import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { roles } from "./roles";

export const users = pgTable("users", {
    email: text("email").primaryKey(),
    roles: roles("roles")
        .array()
        .notNull()
        .default(sql`'{}'::roles[]`),
});
