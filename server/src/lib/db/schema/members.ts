import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
    id: serial("id").primaryKey(),
    year: text("year").notNull(),
    current: boolean("current").notNull(),
    student: text("student").notNull(),
    designation: text("designation").notNull().default("member"),
    team: text("team"),
    contact: text("contact"),
    socials: text("socials"),
});
