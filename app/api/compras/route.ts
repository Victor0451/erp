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
    if (f === "traer compras") {
      const data = await db.$queryRaw(Prisma.sql`
          SELECT
            c.idproducto, c.idcompra, P.producto, C.moneda, C.cantidad,
            C.importe, C.fecha, C.observacion, C.nro_factura, R.proveedor 
          FROM ${Prisma.raw(schema)}.compras AS C 
          INNER JOIN ${Prisma.raw(schema)}.productos AS P ON P.idproducto = C.idproducto
          INNER JOIN ${Prisma.raw(schema)}.proveedores AS R ON R.idproveedor = C.idproveedor
        `);
      return NextResponse.json(data);
    }

    if (f === "traer productos compra") {
      const data = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.productos WHERE estado = true`
      );
      return NextResponse.json(data);
    }

    if (f === "traer productos categoria") {
      const id = req.nextUrl.searchParams.get("id");
      if (!id) return NextResponse.json({ error: "ID de categoría no proporcionado" }, { status: 400 });

      const data = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.productos WHERE idcategoria = ${parseInt(id, 10)}`
      );
      return NextResponse.json(data);
    }

    if (f === "traer productos categoria compra") {
      const id = req.nextUrl.searchParams.get("id");
      if (!id) return NextResponse.json({ error: "ID de categoría no proporcionado" }, { status: 400 });

      const data = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.productos WHERE idcategoria = ${parseInt(id, 10)} AND estado = true`
      );
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en GET /api/compras:", error);
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

    if (body.f === "reg compra") {
      // Validar y parsear los datos de entrada
      const fecha = new Date(body.fecha);
      const idproducto = parseInt(body.idproducto, 10);
      const cantidad = parseInt(body.cantidad, 10);
      const importe = parseFloat(body.importe);
      const idproveedor = parseInt(body.idproveedor, 10);

      const result = await db.$executeRaw(Prisma.sql`
          INSERT INTO ${Prisma.raw(schema)}.compras
          (fecha, idproducto, cantidad, importe, idproveedor, moneda, nro_factura, observacion)
          VALUES
          (${fecha}, ${idproducto}, ${cantidad}, ${importe}, ${idproveedor}, ${body.moneda}, ${body.nro_factura}, ${body.observacion})
        `);

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en POST /api/compras:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();

  if (body.f === "flag") {
    // Lógica para PUT aquí, si es necesaria
  }

  return NextResponse.json({ message: "Método no implementado" }, { status: 404 });
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
    if (f === "eliminar compra") {
      if (!id) {
        return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
      }

      const result = await db.$executeRaw(
        Prisma.sql`DELETE FROM ${Prisma.raw(schema)}.compras WHERE idcompra = ${parseInt(id, 10)}`
      );

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en DELETE /api/compras:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
