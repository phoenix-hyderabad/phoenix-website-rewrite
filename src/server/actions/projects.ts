"use server";

import { db } from "~/server/db";

export const getProjects = async () => {
  return await db.query.projects.findMany({
    where(fields, { isNotNull }) {
      return isNotNull(fields.current);
    },
  });
};

export type Project = Awaited<ReturnType<typeof getProjects>>[number];
