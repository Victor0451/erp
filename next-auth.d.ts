import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Use string if not using a Prisma enum
      tenantID: number | null;
      tenantName: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: string;
    tenantID: number | null;
    tenantName: string | null;
  }
}