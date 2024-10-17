import { pgEnum } from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", ["member", "por", "professor", "admin"]);
export type Role = (typeof roles.enumValues)[number];
