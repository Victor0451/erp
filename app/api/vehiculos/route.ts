import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

export async function GET(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");

  if (f === "traer vehiculos") {
    let data = await db.$queryRawUnsafe(`SELECT * FROM cari.vehiculos`);
    await db.$disconnect();

    return NextResponse.json(data);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  if (body.f === "reg vehiculo") {
    const user = await db.$queryRawUnsafe(
      `
        INSERT INTO cari.vehiculos
        (
          vehiculo,
          patente,
          modelo,
          observacion,
          estado
        )
        VALUES
        (  
          '${body.vehiculo}',          
          '${body.patente}',
          ${parseInt(body.modelo)},          
          '${body.observacion}',          
          true
        )
    `
    );

    await db.$disconnect();

    return NextResponse.json(user);
  }
}

export async function DELETE(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");
  let id = req.nextUrl.searchParams.get("id");

  if (f === "eliminar vehiculo") {
    let data = await db.$queryRawUnsafe(
      `DELETE FROM cari.vehiculos WHERE idvehiculo = ${id}`
    );

    await db.$disconnect();

    return NextResponse.json(data);
  }
}
