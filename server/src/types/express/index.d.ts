import type { Role } from "@/lib/db/schema/roles";
import type { User } from "@/types/auth";

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            roles?: Role[];
        }
    }
}
