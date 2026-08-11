import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

import { loginSchema } from "@/features/identity/schemas/login.schema";
import { userRepository } from "@/features/identity/repositories/user.repository";
import { prisma } from "../../../lib/prisma";


export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await userRepository.findByEmail(parsed.data.email);

        if (!user || !user.isActive) {
          return null;
        }

        const validPassword = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // فقط در زمان login اولیه
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // بررسی وضعیت کاربر در دیتابیس
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: token.id,
          },
          select: {
            isActive: true,
            role: true,
          },
        });

        if (!dbUser || !dbUser.isActive) {
          throw new Error("User is inactive or deleted");
        }

        // اگر نقش کاربر در DB تغییر کرده باشد،
        // توکن هم با نقش جدید به‌روزرسانی می‌شود.
        token.role = dbUser.role;
      }

      return token;
    },

   async session({ session, token }) {
  if (session.user && token.id && token.role) {
    session.user.id = token.id;
    session.user.role = token.role;
  }

  return session;
},

    },
  
};