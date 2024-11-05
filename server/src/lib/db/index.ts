import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { CONFIG_PG } from "@/config/environment";

import * as roles from "./schema/roles";
import * as users from "./schema/users";
import * as inductions from "./schema/inductions";
import * as professors from "./schema/professors";
import * as members from "./schema/members";
import * as projects from "./schema/projects";
import * as config from "./schema/config";

const pool = new Pool({
    ...CONFIG_PG,
});

const db = drizzle(pool, {
    schema: {
        ...roles,
        ...users,
        ...inductions,
        ...professors,
        ...members,
        ...projects,
        ...config,
    },
});

export default db;
