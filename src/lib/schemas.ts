import { z } from "zod";
import { type members, type professors, teams } from "~/server/db/schema";

const emptyStringToUndefined = (e?: string) => (e === "" ? undefined : e);

export const addMemberSchema: z.ZodType<typeof members.$inferInsert> = z.object(
  {
    uid: z.string().nonempty("UID cannot be empty"),
    name: z
      .string()
      .trim()
      .min(4, "Name should have at least 4 characters")
      .max(48, "Name should have at most 48 characters"),
    year: z.coerce
      .number()
      .int()
      .min(2020, "Year cannot be less than 2020")
      .max(
        new Date().getFullYear(),
        "Must be equal to or less than the current year",
      ),
    ispor: z.boolean().optional(),
    designation: z.string().trim().optional().transform(emptyStringToUndefined),
    team: z.union([z.null(), z.enum(teams.enumValues)]).optional(),
    project: z.string().trim().optional().transform(emptyStringToUndefined),
    ispoc: z.boolean().optional(),
    link: z
      .union([
        z.string().trim().url("Link must be a valid URL"),
        z.string().trim().length(0),
      ])
      .optional()
      .transform(emptyStringToUndefined),
    contact: z
      .union([
        z.string().length(10, "Phone number should have 10 digits"),
        z.string().length(0),
      ])
      .optional()
      .transform(emptyStringToUndefined),
  },
);

export const deleteMemberSchema = z.object({
  uid: z.string().nonempty("UID cannot be empty"),
  year: z.number().int(),
});

export const addProfessorSchema: z.ZodType<typeof professors.$inferInsert> =
  z.object({
    name: z
      .string()
      .trim()
      .nonempty("This field is required")
      .min(4, "Name should have a minimum of 4 characters")
      .max(48, "Name should have a maximum of 48 characters"),
    designation: z
      .string()
      .trim()
      .nonempty("This field is required")
      .min(4, "Designation should have a minimum of 4 characters")
      .max(48, "Designation should have a maximum of 48 characters"),
    qualification: z
      .string()
      .trim()
      .nonempty("This field is required")
      .min(2, "Qualification should have a minimum of 2 characters")
      .max(48, "Designation should have a maximum of 48 characters"),
    joinedBits: z
      .string()
      .trim()
      .nonempty("This field is required")
      .min(4, "Minimum 4 characters")
      .max(24, "Maximum 24 characters"),
    interests: z
      .string()
      .trim()
      .max(192, "Maximum 192 characters")
      .optional()
      .transform(emptyStringToUndefined),
    coursesTaught: z
      .string()
      .trim()
      .max(192, "Maximum 192 characters")
      .optional()
      .transform(emptyStringToUndefined),
    experience: z
      .string()
      .trim()
      .max(192, "Maximum 192 characters")
      .optional()
      .transform(emptyStringToUndefined),
    researchLab: z
      .string()
      .trim()
      .max(192, "Maximum 192 characters")
      .optional()
      .transform(emptyStringToUndefined),
  });

export const deleteProfessorSchema = z.object({
  id: z.number(),
});
