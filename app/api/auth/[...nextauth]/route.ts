import NextAuth from "next-auth";

import connectDatabase from "@/utils/connectdatabase";

import { config } from "@/utils/authOptions";

connectDatabase();

const handler = NextAuth(config);
export { handler as GET, handler as POST };
