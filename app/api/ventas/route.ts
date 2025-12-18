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
    if (f === "traer ventas") {
      // NOTA: La consulta original unía 'ventas' con 'proveedores'. Esto podría ser un error.
      // Si las ventas son a clientes, deberías unir con una tabla de 'clientes'.
      // Por ahora, se replica la lógica original de forma segura.
      const data = await db.$queryRaw(Prisma.sql`
          SELECT
            c.idproducto, c.idventa, P.producto, C.moneda, C.cantidad,
            C.importe, C.fecha, C.observacion, C.nro_factura, R.cliente 
          FROM ${Prisma.raw(schema)}.ventas AS C 
          INNER JOIN ${Prisma.raw(schema)}.productos AS P ON P.idproducto = C.idproducto
          INNER JOIN ${Prisma.raw(schema)}.clientes AS R ON R.idcliente = C.idcliente
        `);
      return NextResponse.json(data);
    }

    if (f === "traer productos venta") {
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

    if (f === "traer productos categoria venta") {
      const id = req.nextUrl.searchParams.get("id");
      if (!id) return NextResponse.json({ error: "ID de categoría no proporcionado" }, { status: 400 });

      const data = await db.$queryRaw(
        Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.productos WHERE idcategoria = ${parseInt(id, 10)} AND estado = true`
      );
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en GET /api/ventas:", error);
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

    if (body.f === "reg venta") {
      const fecha = new Date(body.fecha);
      const idproducto = parseInt(body.idproducto, 10);
      const cantidad = parseInt(body.cantidad, 10);
      const importe = parseFloat(body.importe);
      const idcliente = parseInt(body.idcliente, 10); // Asumiendo que esto debería ser idcliente

      const result = await db.$executeRaw(Prisma.sql`
          INSERT INTO ${Prisma.raw(schema)}.ventas
          (fecha, idproducto, cantidad, importe, idcliente, moneda, nro_factura, observacion)
          VALUES
          (${fecha}, ${idproducto}, ${cantidad}, ${importe}, ${idcliente}, ${body.moneda}, ${body.nro_factura}, ${body.observacion})
        `);

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en POST /api/ventas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const schema = session.user.tenantName;
  const body = await req.json();

  try {
    if (body.f === "act venta") {
      const fecha = new Date(body.fecha);
      const idproducto = parseInt(body.idproducto, 10);
      const cantidad = parseInt(body.cantidad, 10);
      const importe = parseFloat(body.importe);
      const idcliente = parseInt(body.idcliente, 10);
      const idventa = parseInt(body.idventa, 10);

      const result = await db.$executeRaw(Prisma.sql`
          UPDATE ${Prisma.raw(schema)}.ventas
          SET fecha = ${fecha}, 
              idproducto = ${idproducto}, 
              cantidad = ${cantidad}, 
              importe = ${importe}, 
              idcliente = ${idcliente}, 
              moneda = ${body.moneda}, 
              nro_factura = ${body.nro_factura}, 
              observacion = ${body.observacion}
          WHERE idventa = ${idventa}
        `);

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en PUT /api/ventas:", error);
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
    if (f === "eliminar venta") {
      if (!id) {
        return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
      }

      const result = await db.$executeRaw(
        Prisma.sql`DELETE FROM ${Prisma.raw(schema)}.ventas WHERE idventa = ${parseInt(id, 10)}`
      );

      return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
  } catch (error) {
    console.error("Error en DELETE /api/ventas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
