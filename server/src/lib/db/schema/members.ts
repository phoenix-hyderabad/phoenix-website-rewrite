import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { customText } from "./professors";

export const members = pgTable("members", {
    id: serial("id").primaryKey(),
    year: text("year").notNull(),
    current: boolean("current").notNull(),
    student: text("student").notNull(),
    designation: text("designation").notNull().default("member"),
    team: customText("team"),
    contact: customText("contact").default(null),
    socials: customText("socials").default(null),
});
