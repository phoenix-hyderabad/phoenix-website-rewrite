"use server";

import { db } from "~/server/db";

export const getNews = async () => {
  const data = await db.query.news.findMany({
    limit: 10,
  });
  return data;
};

export type News = Awaited<ReturnType<typeof getNews>>[number];
