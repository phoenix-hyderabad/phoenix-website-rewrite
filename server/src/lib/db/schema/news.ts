import { pgTable, text } from "drizzle-orm/pg-core";
import { members } from "./members";

export const news = pgTable("news", {
    title: text("title").notNull(),
    url: text("url"),
    description: text("description").notNull(),
    venue: text("venue").notNull(),
    timings: text("timings").notNull(),
    contactName: text("contact_name"),
    contactNumber: text("contact_number"),
});
