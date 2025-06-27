"use server";

import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { checkAccess } from "~/lib/auth";
import { professors } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { addProfessorSchema, deleteProfessorSchema } from "~/lib/schemas";

export const getProfessors = async () => {
  return await db.query.professors.findMany({
    orderBy(fields, { desc }) {
      return desc(fields.name);
    },
  });
};

export const addProfessor = async (data: typeof professors.$inferInsert) => {
  const session = await auth();
  checkAccess(session, "professors:edit");
  const parsed = addProfessorSchema.parse(data);
  await db
    .insert(professors)
    .values(parsed)
    .onConflictDoUpdate({
      set: {
        ...parsed,
      },
      target: professors.id,
    });
};

export const deleteProfessor = async (data: { id: number }) => {
  const session = await auth();
  checkAccess(session, "professors:edit");
  const parsed = deleteProfessorSchema.parse(data);
  await db.delete(professors).where(eq(professors.id, parsed.id));
};
