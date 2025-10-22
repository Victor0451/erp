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
    if (f === "traer vehiculos") {
      const data = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.vehiculos`
      );
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en GET /api/vehiculos:", error);
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

    if (body.f === "reg vehiculo") {
      const result = await db.$executeRaw(Prisma.sql`
          INSERT INTO ${Prisma.raw(schema)}.vehiculos
          (vehiculo, patente, modelo, observacion, estado)
          VALUES
          (${body.vehiculo}, ${body.patente}, ${parseInt(body.modelo, 10)}, ${body.observacion}, true)
        `);

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en POST /api/vehiculos:", error);
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
    if (f === "eliminar vehiculo") {
      if (!id) {
        return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
      }

      const result = await db.$executeRaw(
        Prisma.sql`DELETE FROM ${Prisma.raw(schema)}.vehiculos WHERE idvehiculo = ${parseInt(id, 10)}`
      );

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en DELETE /api/vehiculos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
