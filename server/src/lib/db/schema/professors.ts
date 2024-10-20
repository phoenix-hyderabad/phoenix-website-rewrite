import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
export const customText = customType<{ data: string | null }>({
    dataType() {
        return "text";
    },
});

export const professors = pgTable("professors", {
    id: serial("id").primaryKey(),
    faculty: text("faculty").notNull(),
    designation: text("designation").notNull(),
    qualification: text("qualification").notNull(),
    joinedBits: text("joined_bits").notNull(),
    interests: text("interests").notNull(),
    coursesTaught: text("courses_taught").notNull(),
    experiences: customText("experiences").default(null),
    labWebsite: customText("lab_website").default(null),
    researchLab: customText("research_lab").default(null),
});
