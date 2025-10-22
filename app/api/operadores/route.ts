import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendOperatorCreationEmail } from "@/lib/mail";

export async function GET(req: NextRequest) {
  const session = await auth();
  // Solo el admin del tenant puede ver los operadores
  if (!session?.user?.tenantID || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName; // El schema es el mismo para el admin y sus operadores
  const tenantId = session.user.tenantID;
  const f = req.nextUrl.searchParams.get("f");

  try {
    if (f === "traer operadores") {
      // Traer todos los usuarios que pertenecen al mismo tenant
      const data = await db.user.findMany({
        where: {
          tenantID: tenantId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          estado: true,
        },
      });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en GET /api/operadores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  // Solo el admin del tenant puede crear operadores
  if (!session?.user?.tenantID || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.f === "reg operador") {
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
      }

      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "El email ya está en uso" }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newOperator = await db.user.create({
        data: {
          id: nanoid(),
          name,
          email,
          password: hashedPassword,
          role: "user", // El nuevo usuario es un operador
          tenantID: session.user.tenantID, // Se asigna el tenantID del admin que lo crea
          tenantName: session.user.tenantName, // Se asigna el tenantName del admin
          emailVerified: new Date(), // Se asume verificado ya que lo crea el admin
          updatedAt: new Date(),
          estado: true, // Operador activo por defecto
        },
      });

      // Enviar correo de bienvenida al nuevo operador
      await sendOperatorCreationEmail(newOperator.email, newOperator.name || "Usuario");

      return NextResponse.json({ success: true, user: newOperator });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en POST /api/operadores:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  // Solo el admin del tenant puede eliminar operadores
  if (!session?.user?.tenantID || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID de operador no proporcionado" }, { status: 400 });
  }

  // Un admin no puede eliminarse a sí mismo
  if (id === session.user.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta de administrador." }, { status: 403 });
  }

  try {
    const result = await db.user.delete({
      where: {
        id: id,
        tenantID: session.user.tenantID, // Asegurarse que solo borre usuarios de su tenant
      },
    });

    return NextResponse.json({ success: true, affectedRows: 1 });
  } catch (error) {
    console.error("Error en DELETE /api/operadores:", error);
    // Puede que el usuario no exista, Prisma tira un error P2025
    return NextResponse.json({ error: "Operador no encontrado o error interno." }, { status: 500 });
  }
}