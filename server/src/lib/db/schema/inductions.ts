import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const inductions = pgTable("inductions", {
    name: text("name").primaryKey(),
    url: text("url").notNull(),
    isOpen: boolean("is_open").notNull().default(false),
});
