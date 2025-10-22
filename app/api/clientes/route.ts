import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName;
  const f = req.nextUrl.searchParams.get("f");

  try {
    if (f === "traer clientes") {
      const data: any[] = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.clientes`
      );

      // Convertir BigInt a Number para que sea serializable a JSON
      const serializableData = data.map((cliente) => ({
        ...cliente,
        dni: cliente.dni ? Number(cliente.dni) : null,
        telefono: cliente.telefono ? Number(cliente.telefono) : null,
      }));

      return NextResponse.json(serializableData);
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en GET /api/clientes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName;

  try {
    const body = await req.json();

    if (body.f === "reg cliente") {
      const { cliente, dni, calle, numero, barrio, telefono, mail } = body;

      // Simple validation
      if (!cliente || !dni || !calle || !numero || !barrio || !telefono || !mail) {
        return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
      }

      const result = await db.$executeRaw(Prisma.sql`
          INSERT INTO ${Prisma.raw(schema)}.clientes
          (cliente, dni, calle, numero, barrio, telefono, mail)
          VALUES
          (${cliente}, ${dni}, ${calle}, ${numero}, ${barrio}, ${telefono}, ${mail})
        `);

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en POST /api/clientes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName;
  const f = req.nextUrl.searchParams.get("f");
  const id = req.nextUrl.searchParams.get("id");

  try {
    if (f === "eliminar cliente") {
      if (!id) {
        return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
      }

      const result = await db.$executeRaw(
        Prisma.sql`DELETE FROM ${Prisma.raw(schema)}.clientes WHERE idcliente = ${parseInt(id, 10)}`
      );

      if (result === 0) {
        return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
      }

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en DELETE /api/clientes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}