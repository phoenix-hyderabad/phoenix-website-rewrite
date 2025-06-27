import { db } from "~/server/db";
import { members } from "~/server/db/schema";
import memberData from "./data/members";

const addMembers = async () => {
  await db.insert(members).values(memberData).onConflictDoNothing();
};

void addMembers();

export default addMembers;
