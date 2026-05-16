import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const handler = NextAuth(authConfig);

const auth = cache(() => getServerSession(authConfig));

export { handler as handlers, auth };
