import db from "@/lib/db";
import projectData from "./data/projects";
import { projects } from "@/lib/db/schema/projects";

const addProjects = async () => {
    await db.insert(projects).values(projectData).onConflictDoNothing();
};

export default addProjects;
