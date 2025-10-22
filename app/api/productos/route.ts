import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * Maneja las solicitudes GET para obtener productos.
 * Se requiere el parámetro de consulta 'f=traer productos'.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Extraemos el tenantName (schema) de la sesión de forma segura
  const schema = session.user.tenantName;
  const f = req.nextUrl.searchParams.get("f");

  if (f === "traer productos") {
    try {
      // Usamos consultas parametrizadas para seguridad
      const data = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.productos`
      );
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  } else if (f === "traer productos categoria") {
    let id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de categoría no proporcionado" },
        { status: 400 }
      );
    }

    try {
      // Usamos consultas parametrizadas para seguridad
      const data = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(
          schema
        )}.productos WHERE idcategoria = ${parseInt(id, 10)}
        `
      );
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Parámetro 'f' no válido" },
    { status: 400 }
  );
}

/**
 * Maneja las solicitudes POST para crear un nuevo producto.
 */
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
      INSERT INTO ${Prisma.raw(schema)}.productos
      (producto, alta, unidad, stock, idcategoria, observacion, precio_unitario, estado)
      VALUES
      (${body.producto}, ${new Date(body.alta)}, ${body.unidad}, ${body.stock}, ${
      body.idcategoria
    }, ${body.observacion}, ${body.precio_unitario}, ${true})
    `
  );

  return NextResponse.json({ success: true, affectedRows: result });
}

/**
 * Maneja las solicitudes DELETE para eliminar un producto.
 * Se requiere 'f=eliminar productos' y el 'id' del producto.
 */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName;
  const f = req.nextUrl.searchParams.get("f");
  const id = req.nextUrl.searchParams.get("id");

  if (f === "eliminar productos") {
    if (!id) {
      return NextResponse.json(
        { error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    // Usamos consultas parametrizadas para seguridad
    const result = await db.$executeRaw(
      Prisma.sql`DELETE FROM ${Prisma.raw(
        schema
      )}.productos WHERE idproducto = ${parseInt(id, 10)}`
    );

    return NextResponse.json({ success: true, affectedRows: result });
  }

  return NextResponse.json(
    { error: "Parámetro 'f' no válido" },
    { status: 400 }
  );
}
