import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Extraemos el tenantName (schema) de la sesión de forma segura
  const schema = session.user.tenantName;

  const f = req.nextUrl.searchParams.get("f");

  if (f === "traer categorias") {
    // Usamos consultas parametrizadas para seguridad
    const data = await db.$queryRaw(
      Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.categorias`
    );
    return NextResponse.json(data);
  }

  return NextResponse.json(
    { error: "Parámetro 'f' no válido" },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName;
  const body = await req.json();

  // Prevenimos SQL Injection usando parámetros
  const result = await db.$executeRaw(
    Prisma.sql`
      INSERT INTO ${Prisma.raw(schema)}.categorias
      (categoria, descripcion)
      VALUES
      (${body.categoria}, ${body.descripcion})
    `
  );

  return NextResponse.json({ success: true, affectedRows: result });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName;
  const f = req.nextUrl.searchParams.get("f");
  const id = req.nextUrl.searchParams.get("id");

  if (f === "eliminar categorias") {
    if (!id) {
      return NextResponse.json(
        { error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    // Usamos consultas parametrizadas para seguridad
    const result = await db.$executeRaw(
      Prisma.sql`
        DELETE FROM ${Prisma.raw(schema)}.categorias 
        WHERE idcategoria = ${parseInt(id, 10)}`
    );

    return NextResponse.json({ success: true, affectedRows: result });
  }

  return NextResponse.json(
    { error: "Parámetro 'f' no válido" },
    { status: 400 }
  );
}
