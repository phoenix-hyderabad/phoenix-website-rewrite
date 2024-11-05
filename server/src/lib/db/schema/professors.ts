import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const professors = pgTable("professors", {
    id: integer("id").primaryKey(),
    faculty: text("faculty").notNull(),
    designation: text("designation").notNull(),
    qualification: text("qualification").notNull(),
    joinedBits: text("joined_bits").notNull(),
    interests: text("interests").notNull(),
    coursesTaught: text("courses_taught"),
    experiences: text("experiences"),
    labWebsite: text("lab_website"),
    researchLab: text("research_lab"),
});
