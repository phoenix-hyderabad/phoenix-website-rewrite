"use server";
import { db } from "~/server/db";
import { inductions } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "~/server/auth";
import { checkAccess } from "~/lib/auth";

export const getInductions = async () => {
  const data = await db
    .select()
    .from(inductions)
    .orderBy(desc(inductions.name));
  return data;
};

export const updateInduction = async (
  name: string,
  url: string,
  isOpen: boolean,
) => {
  const session = await auth();
  checkAccess(session, "induction:edit");
  const updated = await db
    .update(inductions)
    .set({
      isOpen,
      url,
    })
    .where(eq(inductions.name, name))
    .returning();
  if (updated.length) return updated[0]!;
  else throw new Error("Induction does not exist");
};

export type Induction = Awaited<ReturnType<typeof getInductions>>[number];
