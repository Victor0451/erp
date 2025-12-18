import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * Maneja las solicitudes GET para obtener facturas.
 * Se requiere el parámetro de consulta 'f=traer facturas'.
 */
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.tenantName) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const schema = session.user.tenantName;
    const f = req.nextUrl.searchParams.get("f");

    if (f === "traer facturas") {
        try {
            const data: any[] = await db.$queryRaw(
                Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.facturacion ORDER BY fecha DESC`
            );

            // Convertir BigInt a Number para que sea serializable a JSON
            const serializableData = data.map((factura) => ({
                ...factura,
                importe: factura.importe ? Number(factura.importe) : null,
            }));

            return NextResponse.json(serializableData);
        } catch (error) {
            console.error("Error al obtener facturas:", error);
            return NextResponse.json(
                { error: "Error interno del servidor" },
                { status: 500 }
            );
        }
    } else if (f === "traer facturas anio") {
        const anio = req.nextUrl.searchParams.get("anio");
        if (!anio) {
            return NextResponse.json(
                { error: "Año no proporcionado" },
                { status: 400 }
            );
        }
        try {
            const data: any[] = await db.$queryRaw(
                Prisma.sql`SELECT * FROM ${Prisma.raw(schema)}.facturacion WHERE anio = ${parseInt(anio, 10)} ORDER BY fecha DESC`
            );

            // Convertir BigInt a Number para que sea serializable a JSON
            const serializableData = data.map((factura) => ({
                ...factura,
                importe: factura.importe ? Number(factura.importe) : null,
            }));

            return NextResponse.json(serializableData);
        } catch (error) {
            console.error("Error al obtener facturas por año:", error);
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
 * Maneja las solicitudes POST para crear una nueva factura.
 */
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.tenantName) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const schema = session.user.tenantName;
    const body = await req.json();

    const anio = new Date(body.fecha).getFullYear();

    const result = await db.$executeRaw(
        Prisma.sql`
      INSERT INTO ${Prisma.raw(schema)}.facturacion
      (fecha, idproveedor, nro_factura, descripcion, importe, moneda, anio)
      VALUES
      (${new Date(body.fecha)}, ${body.idproveedor}, ${body.nro_factura}, ${body.descripcion}, ${body.importe}, ${body.moneda}, ${anio})
    `
    );

    return NextResponse.json({ success: true, affectedRows: result });
}

/**
 * Maneja las solicitudes PUT para actualizar una factura.
 */
export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.tenantName) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const schema = session.user.tenantName;

    try {
        const body = await req.json();

        if (body.f === "act factura") {
            const { idfactura, fecha, idproveedor, nro_factura, descripcion, importe, moneda } = body;

            if (!idfactura) {
                return NextResponse.json({ error: "ID de factura no proporcionado" }, { status: 400 });
            }

            const anio = new Date(fecha).getFullYear();

            const result = await db.$executeRaw(
                Prisma.sql`
                    UPDATE ${Prisma.raw(schema)}.facturacion
                    SET fecha = ${new Date(fecha)}, 
                        idproveedor = ${idproveedor}, 
                        nro_factura = ${nro_factura}, 
                        descripcion = ${descripcion}, 
                        importe = ${importe}, 
                        moneda = ${moneda}, 
                        anio = ${anio}
                    WHERE idfactura = ${parseInt(idfactura, 10)}
                `
            );

            if (result === 0) {
                return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
            }

            return NextResponse.json({ success: true, affectedRows: result });
        }

        return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
    } catch (error) {
        console.error("Error en PUT /api/facturacion:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

/**
 * Maneja las solicitudes DELETE para eliminar una factura.
 */
export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.tenantName) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const schema = session.user.tenantName;
    const f = req.nextUrl.searchParams.get("f");
    const id = req.nextUrl.searchParams.get("id");

    if (f === "eliminar factura") {
        if (!id) {
            return NextResponse.json(
                { error: "ID no proporcionado" },
                { status: 400 }
            );
        }

        const result = await db.$executeRaw(
            Prisma.sql`DELETE FROM ${Prisma.raw(
                schema
            )}.facturacion WHERE idfactura = ${parseInt(id, 10)}`
        );

        return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json(
        { error: "Parámetro 'f' no válido" },
        { status: 400 }
    );
}
