import { AppError, HttpCode } from "@/config/errors";
import { type Role } from "@/lib/db/schema/roles";
import { type Access } from "@/types/auth";
import { type NextFunction, type Request, type Response } from "express";

export type RoleAccessMap = {
    [role in Role]: Access;
};

const roleAccessMap: Partial<RoleAccessMap> = {
    admin: {
        allowed: ["*"],
        disallowed: [],
    },
    por: {
        allowed: ["induction:update_status"],
        disallowed: ["disabled"],
    },
};

function matchWildcard(resource: string, pattern: string): boolean {
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
    return regex.test(resource);
}

// flatten array of roles
export function getAccess(roles: Role[]): Access {
    const allowed = new Set<string>();
    const disallowed = new Set<string>();
    roles.forEach((role) => {
        const roleAccess = roleAccessMap[role];
        if (roleAccess) {
            roleAccess.disallowed.forEach((op) => {
                if (![...allowed].some((pat) => matchWildcard(op, pat)))
                    disallowed.add(op);
            });
            roleAccess.allowed.forEach((op) => allowed.add(op));
        }
    });
    return {
        allowed: [...allowed],
        disallowed: [...disallowed],
    };
}

// middleware function
export function checkAccess(requiredOperation: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(
                new AppError({
                    httpCode: HttpCode.UNAUTHORIZED,
                    description: "Unauthenticated",
                })
            );
        }
        const access = req.user.operations;
        if (
            access.disallowed.some((op) => matchWildcard(requiredOperation, op))
        ) {
            return next(
                new AppError({
                    httpCode: HttpCode.FORBIDDEN,
                    description: "Operation not allowed",
                    feedback: "Explicitly disallowed",
                })
            );
        }
        if (
            access.allowed.includes("*") ||
            access.allowed.some((op) => matchWildcard(requiredOperation, op))
        )
            return next();

        return next(
            new AppError({
                httpCode: HttpCode.FORBIDDEN,
                description: "Operation not allowed",
                feedback: "Insufficient permissions",
            })
        );
    };
}
