import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";

export async function GET(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");

  if (f === "traer productos") {
    let data = await db.$queryRawUnsafe(`SELECT * FROM cari.productos`);
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

  if (body.f === "reg producto") {
    const user = await db.$queryRawUnsafe(
      `
        INSERT INTO cari.productos
        (
          producto,
          alta,
          unidad,
          stock,
          idcategoria,
          observacion,
          precio_unitario,
          estado
        )
        VALUES
        (  
          '${body.producto}',
          '${moment(body.alta).format("YYYY-MM-DD")}',
          '${body.unidad}',
          ${parseInt(body.stock)},
          ${parseInt(body.idcategoria)},
          '${body.observacion}',
          ${parseFloat(body.precio_unitario)},
          true
        )
    `
    );

    await db.$disconnect();

    return NextResponse.json(user);
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  if (body.f === "act stock") {
    const stock = await db.$queryRawUnsafe(
      `
        UPDATE cari.productos
        SET stock = stock + ${parseInt(body.cantidad)}
        WHERE idproducto = ${parseInt(body.idproducto)}
      `
    );

    await db.$disconnect();

    return NextResponse.json(stock);
  }
  if (body.f === "act stock venta") {
    const stock = await db.$queryRawUnsafe(
      `
        UPDATE cari.productos
        SET stock = stock - ${parseInt(body.cantidad)}
        WHERE idproducto = ${parseInt(body.idproducto)}
      `
    );

    await db.$disconnect();

    return NextResponse.json(stock);
  } else if (body.f === "act stock del compra") {
    const stock = await db.$queryRawUnsafe(
      `
        UPDATE cari.productos
        SET stock = stock - ${parseInt(body.cantidad)}
        WHERE idproducto = ${parseInt(body.idproducto)}
      `
    );

    await db.$disconnect();

    return NextResponse.json(stock);
  } else if (body.f === "act stock del venta") {
    const stock = await db.$queryRawUnsafe(
      `
        UPDATE cari.productos
        SET stock = stock + ${parseInt(body.cantidad)}
        WHERE idproducto = ${parseInt(body.idproducto)}
      `
    );

    await db.$disconnect();

    return NextResponse.json(stock);
  }
}

export async function DELETE(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");
  let id = req.nextUrl.searchParams.get("id");

  if (f === "eliminar productos") {
    let data = await db.$queryRawUnsafe(
      `DELETE FROM cari.productos WHERE idproducto = ${id}`
    );

    await db.$disconnect();

    return NextResponse.json(data);
  }
}
