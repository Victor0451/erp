import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

export async function GET(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");

  if (f === "traer proveedores") {
    let data = await db.$queryRawUnsafe(`SELECT * FROM cari.proveedores`);

    await db.$disconnect();

    return NextResponse.json(data);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (body.f === "reg proveedor") {
    const user = await db.$queryRawUnsafe(
      `
        INSERT INTO cari.proveedores
        (
          proveedor,
          clave_tributaria,
          tipo_clave,
          domicilio,
          observacion,
          estado
        )
        VALUES
        (  
          '${body.proveedor}',          
          '${body.clave_tributaria}',
          '${body.tipo_clave}',
          '${body.domicilio}',          
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

  if (f === "eliminar proveedor") {
    let data = await db.$queryRawUnsafe(
      `DELETE FROM cari.proveedores WHERE idproveedor = ${id}`
    );

    await db.$disconnect();

    return NextResponse.json(data);
  }
}
