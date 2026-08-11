import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "../../../lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(
    prisma as unknown as Parameters<typeof PrismaAdapter>[0],
  ),
  secret: process.env.NEXTAUTH_SECRET,
});
