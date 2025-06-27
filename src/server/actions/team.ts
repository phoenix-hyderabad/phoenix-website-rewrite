"use server";

import { db } from "~/server/db";
import { members, type Team } from "~/server/db/schema";
import { auth } from "~/server/auth";
import { checkAccess } from "~/lib/auth";
import { and, eq } from "drizzle-orm";
import { addMemberSchema, deleteMemberSchema } from "~/lib/schemas";

const CURRENT_YEAR = 2025;

export const getTeam = async () => {
  const members = await db.query.members.findMany({
    orderBy: (members, { desc }) => [desc(members.year)],
  });
  const accum: Record<
    string,
    {
      year: number;
      term: string;
      current: boolean;
      pors: {
        uid: string;
        student: string;
        designation: string;
        contact?: string;
        socials?: { site: string; username: string }[];
      }[];
      members: Record<
        Team,
        { uid: string; student: string; link?: string; ispoc?: boolean }[]
      >;
    }
  > = {};

  const groupedAndSortedMembers = members.reduce((acc, member) => {
    const nextyear = member.year + 1;
    const term =
      member.year.toString() + `-${nextyear % 100 ? nextyear % 100 : nextyear}`;

    if (!acc[term]) {
      acc[term] = {
        year: member.year,
        term,
        current: member.year === CURRENT_YEAR,
        pors: [],
        members: {
          it: [],
          tech: [],
          editorial: [],
          design: [],
        },
      };
    }
    if (member.ispor) {
      acc[term].pors.push({
        uid: member.uid,
        student: member.name,
        designation: member.designation,
        contact: member.contact ?? undefined,
        socials: [],
      });
    }

    if (member.team) {
      const team = member.team;
      if (!acc[term].members[team]) {
        acc[term].members[team] = [];
      }
      acc[term].members[team].push({
        uid: member.uid,
        student: member.name,
        link: member.link ?? undefined,
        ispoc: member.ispoc || undefined,
      });
    }

    return acc;
  }, accum);

  return Object.values(groupedAndSortedMembers);
};

export const addMember = async (data: typeof members.$inferInsert) => {
  const session = await auth();
  checkAccess(session, "members:edit");
  const parsed = addMemberSchema.parse(data);
  await db
    .insert(members)
    .values(parsed)
    .onConflictDoUpdate({
      set: {
        ...parsed,
      },
      target: [members.uid, members.year],
    });
};

export const deleteMember = async (data: { uid: string; year: number }) => {
  const session = await auth();
  checkAccess(session, "members:edit");
  const parsed = deleteMemberSchema.parse(data);
  await db
    .delete(members)
    .where(and(eq(members.uid, parsed.uid), eq(members.year, parsed.year)));
};

export type TeamType = Awaited<ReturnType<typeof getTeam>>[number];
