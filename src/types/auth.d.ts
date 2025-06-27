import { type DefaultSession } from "next-auth";
import type { Role } from "~/server/db/schema";

export interface Access {
  allowed: string[];
  disallowed: string[];
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      operations: Access;
    } & DefaultSession["user"];
  }
  interface User {
    roles?: Role[];
  }
}
