import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
    key: text("key").primaryKey(),
    name: text("name").notNull().unique(),
    cover: text("cover").notNull(),
    problemStatement: text("problem_statement").notNull(),
    current: boolean("current").default(true),
});
