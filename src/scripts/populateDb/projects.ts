import { db } from "~/server/db";
import projectData from "./data/projects";
import { projects } from "~/server/db/schema";

const addProjects = async () => {
  await db.insert(projects).values(projectData).onConflictDoNothing();
};

void addProjects();

export default addProjects;
