import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.tenantID || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tenantId = session.user.tenantID;

  try {
    const tenantData = await db.tenant.findUnique({
      where: { tenantID: tenantId },
    });

    return NextResponse.json(tenantData);
  } catch (error) {
    console.error("Error en GET /api/tenant:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();

  // 1. Validar que el usuario sea un administrador de tenant
  if (!session?.user?.tenantID || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      empresa,
      razon_social,
      cuit_cuil,
      direccion,
      telefono,
      email,
      ubicacion,
    } = body;

    // 2. Validar que los campos requeridos no estén vacíos
    if (!empresa || !razon_social || !cuit_cuil) {
      return NextResponse.json(
        { error: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    const tenantId = session.user.tenantID;

    // 3. Actualizar la tabla tenant
    await db.tenant.update({
      where: { tenantID: tenantId },
      data: {
        empresa,
        razon_social,
        cuit_cuil,
        direccion,
        telefono: parseInt(telefono, 10), // Convertir la cadena de texto a número
        email,
        ubicacion,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Perfil de la empresa actualizado.",
    });
  } catch (error) {
    console.error("Error en PUT /api/tenant:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
