import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
    uid: text("uid").primaryKey(),
    name: text("name").notNull(),
    year: text("year").notNull(),
    designation: text("designation").notNull().default("member"),
    team: text("team"),
    contact: text("contact"),
});
