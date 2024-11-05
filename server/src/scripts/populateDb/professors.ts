import db from "@/lib/db";
import professorData from "./data/professors";
import { professors } from "@/lib/db/schema/professors";

const addProfs = async () => {
    await db.insert(professors).values(professorData).onConflictDoNothing();
};

export default addProfs;
