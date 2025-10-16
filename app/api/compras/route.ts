import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

export async function GET(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");

  if (f === "traer compras") {
    let data = await db.$queryRawUnsafe(
      `
        SELECT
          c.idproducto,
          c.idcompra,
          P.producto,
          C.moneda,
          C.cantidad,
          C.importe,
          C.fecha,
          C.observacion,
          C.nro_factura,
          R.proveedor 
        FROM cari.compras AS C 
        INNER JOIN cari.productos AS P ON P.idproducto = C.idproducto
        INNER JOIN cari.proveedores AS R ON R.idproveedor = C.idproveedor



      `
    );
    await db.$disconnect();

    return NextResponse.json(data);
  }
  if (f === "traer productos compra") {
    let data = await db.$queryRawUnsafe(
      `SELECT * FROM cari.productos WHERE estado = true`
    );
    await db.$disconnect();

    return NextResponse.json(data);
  } else if (f === "traer productos categoria") {
    let id = req.nextUrl.searchParams.get("id");

    let data = await db.$queryRawUnsafe(
      `SELECT * FROM cari.productos WHERE idcategoria = ${id}`
    );
    await db.$disconnect();
    return NextResponse.json(data);
  } else if (f === "traer productos categoria compra") {
    let id = req.nextUrl.searchParams.get("id");

    let data = await db.$queryRawUnsafe(
      `SELECT * FROM cari.productos WHERE idcategoria = ${id} AND estado = true`
    );
    await db.$disconnect();
    return NextResponse.json(data);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.f === "reg compra") {
    const user = await db.$queryRawUnsafe(
      `
        INSERT INTO cari.compras
        (
            fecha,
            idproducto,
            cantidad,
            importe,
            idproveedor,
            moneda,
            nro_factura,
            observacion
         
        )
        VALUES
        ( 
          '${moment(body.fecha).format("YYYY-MM-DD")}', 
          ${parseInt(body.idproducto)},          
          ${parseInt(body.cantidad)},
          ${parseFloat(body.importe)},
          ${parseInt(body.idproveedor)},
          '${body.moneda}',
          '${body.nro_factura}',
          '${body.observacion}'      
       
        )
    `
    );

    await db.$disconnect();

    return NextResponse.json(user);
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  if (body.f === "flag") {
  }
}

export async function DELETE(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");
  let id = req.nextUrl.searchParams.get("id");

  if (f === "eliminar compra") {
    let data = await db.$queryRawUnsafe(
      `DELETE FROM cari.compras WHERE idcompra = ${id}`
    );

    await db.$disconnect();

    return NextResponse.json(data);
  }
}
