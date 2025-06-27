import addInductions from "./inductions";
import addProfs from "./professors";
import addProjects from "./projects";
import addMembers from "./members";

await addInductions();
await addProfs();
await addProjects();
await addMembers();

process.exit(0);
