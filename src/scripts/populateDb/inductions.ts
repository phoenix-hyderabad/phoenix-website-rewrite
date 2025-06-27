import { db } from "~/server/db";
import { inductions } from "~/server/db/schema";
import inductionData from "./data/inductions";

const addInductions = async () => {
  await db.insert(inductions).values(inductionData).onConflictDoNothing();
};

void addInductions();

export default addInductions;
