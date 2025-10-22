import NextAuth from "next-auth";
import { type User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    // jwt() se ejecuta cada vez que se crea o actualiza un token JWT.
    // Aquí es donde puedes agregar información adicional al token.
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
      });

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.tenantID = existingUser.tenantID;
      token.tenantName = existingUser.tenantName;

      return token;
    },
    // session() se utiliza para agregar la información del token a la sesión del usuario,
    // lo que hace que esté disponible en el cliente.
    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.tenantID = token.tenantID as number | null;
      session.user.tenantName = token.tenantName as string | null;
      return session;
    },
  },
  events: {
    // El evento linkAccount se dispara cuando una cuenta (proveedor OAuth: GitHub, Google, Facebook, etc.)  se vincula a un usuario existente en tu base de datos.
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  pages: {
    signIn: "/login",
  },
});
