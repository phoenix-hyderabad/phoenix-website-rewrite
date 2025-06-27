import { db } from "~/server/db";
import professorData from "./data/professors";
import { professors } from "~/server/db/schema";

const addProfs = async () => {
  await db.insert(professors).values(professorData).onConflictDoNothing();
};

void addProfs();

export default addProfs;
