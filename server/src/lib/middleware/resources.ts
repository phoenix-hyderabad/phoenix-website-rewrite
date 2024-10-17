import { AppError, HttpCode } from "@/config/errors";
import { Role } from "@/lib/db/schema/roles";
import { NextFunction, Request, Response } from "express";

export type RoleResourceMap = {
    [role in Role]: Record<
        string,
        {
            allowed: string[];
            disallowed: string[];
        }
    >;
};

const roleResourceMap: Partial<RoleResourceMap> = {
    admin: {
        "*": {
            allowed: ["*"],
            disallowed: [],
        },
    },
    por: {
        inductions: {
            allowed: ["change_status"],
            disallowed: [],
        },
    },
};

function matchWildcard(resource: string, pattern: string): boolean {
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
    return regex.test(resource);
}

export function checkAccess(requiredPage: string, requiredOperation: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.roles || !Array.isArray(req.roles)) {
            return next(
                new AppError({
                    httpCode: HttpCode.FORBIDDEN,
                    description: "No roles provided",
                })
            );
        }
        let hasAccess = false;
        req.roles.forEach((role) => {
            const roleResources = roleResourceMap[role];
            if (roleResources) {
                Object.keys(roleResources).forEach((pagePattern) => {
                    const resource = roleResources[pagePattern];
                    if (matchWildcard(requiredPage, pagePattern)) {
                        if (
                            resource.disallowed.some((op) =>
                                matchWildcard(requiredOperation, op)
                            )
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
                            resource.allowed.includes("*") ||
                            resource.allowed.some((op) =>
                                matchWildcard(requiredOperation, op)
                            )
                        ) {
                            hasAccess = true;
                        }
                    }
                });
            }
        });
        if (!hasAccess) {
            return next(
                new AppError({
                    httpCode: HttpCode.FORBIDDEN,
                    description: "Operation not allowed",
                    feedback: "Insufficient permissions",
                })
            );
        }
        next();
    };
}
