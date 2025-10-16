"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { loginSchema, registerSchema } from "@/lib/zod"; // Asegúrate de que registerSchema esté importado
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { Account } from "@prisma/client";
import { nanoid } from "nanoid";

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};

export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    const { data, success } = registerSchema.safeParse(values);
    if (!success) {
      return {
        error: "Invalid data",
      };
    }

    // verificar si el usuario ya existe
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
      include: {
        Account: true,
      },
    });

    if (user) {
      // Verificar si tiene cuentas OAuth vinculadas
      const oauthAccounts = user.Account.filter(
        (Account: Account) => Account.type === "oauth"
      );
      if (oauthAccounts.length > 0) {
        return {
          error:
            "To confirm your identity, sign in with the same account you used originally.",
        };
      }
      return {
        error: "User already exists",
      };
    }

    // hash de la contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    // crear el usuario
    await db.user.create({
      data: {
        id: nanoid(), // Generar un ID único
        email: data.email,
        name: data.name,
        password: passwordHash,
        updatedAt: new Date(), // Establecer la fecha de actualización
      },
    });

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};
