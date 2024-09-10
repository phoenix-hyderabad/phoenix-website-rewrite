import { sql } from "drizzle-orm";
import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { roles } from "./roles";

export const users = pgTable("users", {
    uid: varchar("uid", { length: 16 }).primaryKey(),
    password: text("password"),
    roles: roles("roles")
        .array()
        .notNull()
        .default(sql`'{}'::roles[]`),
});
