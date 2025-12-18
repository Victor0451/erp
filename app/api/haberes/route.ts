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

    if (f === "traer haberes") {
        try {
            // Join with empleados and empleados_categorias to get names and category
            const data: any[] = await db.$queryRaw(
                Prisma.sql`
            SELECT h.*, e.apellido, e.nombre, COALESCE(ec.categoria, 'Sin categoría') as categoria
            FROM ${Prisma.raw(schema)}.haberes h
            JOIN ${Prisma.raw(schema)}.empleados e ON h.idempleado = e.idempleado
            LEFT JOIN ${Prisma.raw(schema)}.empleados_categorias ec ON e.idcategoria = ec.idcategoria
            ORDER BY h.fecha_pago DESC
        `
            );

            // Convertir BigInt a Number para que sea serializable a JSON
            const serializableData = data.map((haber) => ({
                ...haber,
                dias_trabajo: haber.dias_trabajo ? Number(haber.dias_trabajo) : null,
                cant_unitario: haber.cant_unitario ? Number(haber.cant_unitario) : null,
                haberes: haber.haberes ? Number(haber.haberes) : null,
                antiguedad_porcentaje: haber.antiguedad_porcentaje ? Number(haber.antiguedad_porcentaje) : null,
                antiguedad_monto: haber.antiguedad_monto ? Number(haber.antiguedad_monto) : null,
                asig_familiar: haber.asig_familiar ? Number(haber.asig_familiar) : null,
                no_remunerado: haber.no_remunerado ? Number(haber.no_remunerado) : null,
                premio: haber.premio ? Number(haber.premio) : null,
                haberes_brutos: haber.haberes_brutos ? Number(haber.haberes_brutos) : null,
                jubilacion: haber.jubilacion ? Number(haber.jubilacion) : null,
                ley_19032: haber.ley_19032 ? Number(haber.ley_19032) : null,
                obra_social: haber.obra_social ? Number(haber.obra_social) : null,
                renatea: haber.renatea ? Number(haber.renatea) : null,
                cta_solidaria: haber.cta_solidaria ? Number(haber.cta_solidaria) : null,
                total_deducciones: haber.total_deducciones ? Number(haber.total_deducciones) : null,
                haberes_neto: haber.haberes_neto ? Number(haber.haberes_neto) : null,
                anticipo: haber.anticipo ? Number(haber.anticipo) : null,
                cancelacion: haber.cancelacion ? Number(haber.cancelacion) : null,
            }));

            return NextResponse.json(serializableData);
        } catch (error) {
            console.error("Error al obtener haberes:", error);
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
      INSERT INTO ${Prisma.raw(schema)}.haberes
      (idempleado, fecha_pago, dias_trabajo, cant_unitario, haberes, antiguedad_porcentaje, antiguedad_monto, asig_familiar, no_remunerado, premio, haberes_brutos, jubilacion, ley_19032, obra_social, renatea, cta_solidaria, total_deducciones, haberes_neto, anticipo, cancelacion)
      VALUES
      (${body.idempleado}, ${new Date(body.fecha_pago)}, ${body.dias_trabajo}, ${body.cant_unitario}, ${body.haberes}, ${body.antiguedad_porcentaje}, ${body.antiguedad_monto}, ${body.asig_familiar}, ${body.no_remunerado}, ${body.premio}, ${body.haberes_brutos}, ${body.jubilacion}, ${body.ley_19032}, ${body.obra_social}, ${body.renatea}, ${body.cta_solidaria}, ${body.total_deducciones}, ${body.haberes_neto}, ${body.anticipo}, ${body.cancelacion})
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

        if (body.f === "act haber") {
            const { idhaber, idempleado, fecha_pago, dias_trabajo, cant_unitario, haberes, antiguedad_porcentaje, antiguedad_monto, asig_familiar, no_remunerado, premio, haberes_brutos, jubilacion, ley_19032, obra_social, renatea, cta_solidaria, total_deducciones, haberes_neto, anticipo, cancelacion } = body;

            if (!idhaber) {
                return NextResponse.json({ error: "ID de haber no proporcionado" }, { status: 400 });
            }

            const result = await db.$executeRaw(
                Prisma.sql`
                    UPDATE ${Prisma.raw(schema)}.haberes
                    SET idempleado = ${idempleado}, 
                        fecha_pago = ${new Date(fecha_pago)}, 
                        dias_trabajo = ${dias_trabajo}, 
                        cant_unitario = ${cant_unitario}, 
                        haberes = ${haberes}, 
                        antiguedad_porcentaje = ${antiguedad_porcentaje}, 
                        antiguedad_monto = ${antiguedad_monto}, 
                        asig_familiar = ${asig_familiar}, 
                        no_remunerado = ${no_remunerado}, 
                        premio = ${premio}, 
                        haberes_brutos = ${haberes_brutos}, 
                        jubilacion = ${jubilacion}, 
                        ley_19032 = ${ley_19032}, 
                        obra_social = ${obra_social}, 
                        renatea = ${renatea}, 
                        cta_solidaria = ${cta_solidaria}, 
                        total_deducciones = ${total_deducciones}, 
                        haberes_neto = ${haberes_neto}, 
                        anticipo = ${anticipo}, 
                        cancelacion = ${cancelacion}
                    WHERE idhaber = ${parseInt(idhaber, 10)}
                `
            );

            if (result === 0) {
                return NextResponse.json({ error: "Haber no encontrado" }, { status: 404 });
            }

            return NextResponse.json({ success: true, affectedRows: result });
        }

        return NextResponse.json({ error: "Parámetro 'f' no válido" }, { status: 400 });
    } catch (error) {
        console.error("Error en PUT /api/haberes:", error);
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

    if (f === "eliminar haber") {
        if (!id) {
            return NextResponse.json(
                { error: "ID no proporcionado" },
                { status: 400 }
            );
        }

        const result = await db.$executeRaw(
            Prisma.sql`DELETE FROM ${Prisma.raw(
                schema
            )}.haberes WHERE idhaber = ${parseInt(id, 10)}`
        );

        return NextResponse.json({ success: true, affectedRows: result });
    }

    return NextResponse.json(
        { error: "Parámetro 'f' no válido" },
        { status: 400 }
    );
}
