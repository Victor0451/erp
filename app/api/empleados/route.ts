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

    if (f === "traer empleados") {
        try {
            const data = await db.$queryRaw(
                Prisma.sql`
                    SELECT
                        e.idempleado,
                        e.cuil,
                        e.dni,
                        e.apellido,
                        e.nombre,
                        e.fecha_ingreso,
                        e.estado,
                        e.idcategoria,
                        ec.categoria
                    FROM ${Prisma.raw(schema)}.empleados e
                    LEFT JOIN ${Prisma.raw(schema)}.empleados_categorias ec ON e.idcategoria = ec.idcategoria
                    WHERE e.estado = true
                    ORDER BY e.apellido ASC
                `
            );
            return NextResponse.json(data);
        } catch (error) {
            console.error("Error al obtener empleados:", error);
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

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.tenantName) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const schema = session.user.tenantName;
    const body = await req.json();

    const result = await db.$executeRaw(
        Prisma.sql`
      INSERT INTO ${Prisma.raw(schema)}.empleados
      (cuil, dni, apellido, nombre, fecha_ingreso, idcategoria, estado)
      VALUES
      (${body.cuil}, ${body.dni}, ${body.apellido}, ${body.nombre}, ${new Date(body.fecha_ingreso)}, ${parseInt(body.idcategoria, 10)}, ${true})
    `
    );

    return NextResponse.json({ success: true, affectedRows: result });
}

export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.tenantName) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const schema = session.user.tenantName;

    try {
        const body = await req.json();

        if (body.f === "act empleado") {
            const { idempleado, cuil, dni, apellido, nombre, fecha_ingreso, idcategoria } = body;

            if (!idempleado) {
                return NextResponse.json({ error: "ID de empleado no proporcionado" }, { status: 400 });
            }

            const result = await db.$executeRaw(
                Prisma.sql`
                    UPDATE ${Prisma.raw(schema)}.empleados
                    SET cuil = ${cuil},
                        dni = ${dni},
                        apellido = ${apellido},
                        nombre = ${nombre},
                        fecha_ingreso = ${new Date(fecha_ingreso)},
                        idcategoria = ${parseInt(idcategoria, 10)}
                    WHERE idempleado = ${parseInt(idempleado, 10)}
                `
            );

            if (result === 0) {
                return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
            }

            return NextResponse.json({ success: true, affectedRows: result });
        }

        return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
    } catch (error) {
        console.error("Error en PUT /api/empleados:", error);
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

    if (f === "eliminar empleado") {
        if (!id) {
            return NextResponse.json(
                { error: "ID no proporcionado" },
                { status: 400 }
            );
        }

        // Soft delete
        const result = await db.$executeRaw(
            Prisma.sql`UPDATE ${Prisma.raw(
                schema
            )}.empleados SET estado = false WHERE idempleado = ${parseInt(id, 10)}`
        );

        return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json(
        { error: "Parámetro 'f' no válido" },
        { status: 400 }
    );
}
