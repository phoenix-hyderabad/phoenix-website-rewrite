import db from "@/lib/db";
import { inductions } from "@/lib/db/schema/inductions";
import inductionData from "./data/inductions";

const addInductions = async () => {
    await db.insert(inductions).values(inductionData).onConflictDoNothing();
};

export default addInductions;
