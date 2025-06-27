import { type Role } from "~/server/db/schema";
import type { Access } from "../types/auth";
import type { Session } from "next-auth";

export type RoleAccessMap = Record<Role, Access>;

const roleAccessMap: Partial<RoleAccessMap> = {
  admin: {
    allowed: ["*"],
    disallowed: ["block:admin"],
  },
  por: {
    allowed: ["induction:update_status"],
    disallowed: ["block:por"],
  },
};

function matchWildcard(resource: string, pattern: string): boolean {
  const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
  return regex.test(resource);
}

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

export function checkAccess(
  session: Session | null,
  requiredOperation: string,
) {
  if (!session) throw new Error("Not authenticated");
  const access = session.user.operations;
  if (access.disallowed.some((op) => matchWildcard(requiredOperation, op))) {
    throw new Error("Disallowed");
  }
  if (
    access.allowed.includes("*") ||
    access.allowed.some((op) => matchWildcard(requiredOperation, op))
  )
    return;
  throw new Error("Not allowed");
}

export function checkAccessSafe(
  session: Session | null,
  requiredOperation: string,
): boolean {
  try {
    checkAccess(session, requiredOperation);
    return true;
  } catch {
    return false;
  }
}
