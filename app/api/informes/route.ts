import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface TotalProductos {
  count: bigint;
}

interface TotalProveedores {
  count: bigint;
}

interface VentasYComprasStats {
  totalventas: bigint;
  ingresostotales: number;
  gastostotales: number;
}

/**
 * Maneja las solicitudes GET para obtener productos.
 * Se requiere el parámetro de consulta 'f=traer productos'.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantName) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Extraemos el tenantName (schema) de la sesión de forma segura
  const schema = session.user.tenantName;
  const f = req.nextUrl.searchParams.get("f");

  if (f === "est productos") {
    try {
      // Usamos consultas parametrizadas para seguridad
      const totalProductosResult = await db.$queryRaw<TotalProductos[]>(
        Prisma.sql`SELECT COUNT(*) FROM ${Prisma.raw(schema)}.productos`
      );
      const totalProductos = Number(totalProductosResult[0]?.count ?? 0);
      return NextResponse.json(totalProductos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  } else if (f === "est proveedores") {
    try {
      // Usamos consultas parametrizadas para seguridad
      const totalProveedoresResult = await db.$queryRaw<TotalProveedores[]>(
        Prisma.sql`SELECT COUNT(*) FROM ${Prisma.raw(schema)}.proveedores`
      );
      const totalProveedores = Number(totalProveedoresResult[0]?.count ?? 0);
      return NextResponse.json(totalProveedores);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  } else if (f === "est ventas y compras") {
    try {
      // Usamos consultas parametrizadas para seguridad
      const ventasResult = await db.$queryRaw<
        Pick<VentasYComprasStats, "totalventas" | "ingresostotales">[]
      >(
        Prisma.sql`SELECT COUNT(*) as totalventas, COALESCE(SUM(importe), 0) as ingresostotales FROM ${Prisma.raw(
          schema
        )}.ventas`
      );

      const comprasResult = await db.$queryRaw<
        Pick<VentasYComprasStats, "gastostotales">[]
      >(
        Prisma.sql`SELECT COALESCE(SUM(importe), 0) as gastostotales FROM ${Prisma.raw(
          schema
        )}.compras`
      );

      return NextResponse.json({
        totalVentas: Number(ventasResult[0]?.totalventas ?? 0),
        ingresosTotales: Number(ventasResult[0]?.ingresostotales ?? 0),
        gastosTotales: Number(comprasResult[0]?.gastostotales ?? 0),
      });
    } catch (error) {
      console.error("Error al obtener ventas y compras:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  } else if (f === "ventas recientes") {
    try {
      // Usamos consultas parametrizadas para seguridad
      const ventasReciente = await db.$queryRaw(
        Prisma.sql`SELECT v.idventa, v.importe, v.fecha, p.cliente, p.mail
        FROM ${Prisma.raw(schema)}.ventas AS v
        LEFT JOIN ${Prisma.raw(
          schema
        )}.clientes AS p ON v.idcliente = p.idcliente
        ORDER BY v.fecha DESC
        `
      );
      // Convertir BigInt a Number para que sea serializable a JSON
      const serializableData = (ventasReciente as any[]).map((venta) => ({
        ...venta,
        idventa: Number(venta.idventa),
      }));

      return NextResponse.json(serializableData);
    } catch (error) {
      console.error("Error al obtener ventas recientes:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  } else if (f === "ventas por mes") {
    try {
      const salesByMonth: any[] = await db.$queryRaw(
        Prisma.sql`
          SELECT
            TO_CHAR(DATE_TRUNC('month', fecha), 'Mon') AS name,
            EXTRACT(MONTH FROM fecha) AS month_number,
            SUM(importe) AS total
          FROM ${Prisma.raw(schema)}.ventas
          WHERE EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
          GROUP BY name, month_number
          ORDER BY month_number ASC
        `
      );

      // Mapear los resultados a un formato que el gráfico pueda usar y convertir BigInt/Decimal
      const serializableSales = salesByMonth.map(item => ({
        name: item.name.trim(), // Eliminar espacios extra de TO_CHAR
        total: Number(item.total)
      }));

      // Rellenar los meses sin ventas para un gráfico completo
      const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const finalData = allMonths.map(monthName => {
        const found = serializableSales.find(sale => sale.name === monthName);
        return found || { name: monthName, total: 0 };
      });

      return NextResponse.json(finalData);
    } catch (error) {
      console.error("Error al obtener ventas por mes:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  } else if (f === "stock alertas") {
    try {
      const stockAlerts: any[] = await db.$queryRaw(
        Prisma.sql`
          SELECT idproducto, producto, stock
          FROM ${Prisma.raw(schema)}.productos
          WHERE stock <= 5
          ORDER BY stock ASC
        `
      );

      const serializableAlerts = stockAlerts.map((item) => ({
        ...item,
        stock: Number(item.stock),
      }));

      return NextResponse.json(serializableAlerts);
    } catch (error) {
      console.error("Error al obtener alertas de stock:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  } else if (f === "resumen facturacion") {
    try {
      const resumenFacturacion: any[] = await db.$queryRaw(
        Prisma.sql`
          SELECT 
            anio,
            moneda,
            COUNT(*) as cantidad_facturas,
            SUM(importe) as total_importe
          FROM ${Prisma.raw(schema)}.facturacion
          GROUP BY anio, moneda
          ORDER BY anio DESC, moneda ASC
        `
      );

      // Convertir BigInt y Decimal a Number para que sea serializable a JSON
      const serializableData = resumenFacturacion.map((item) => ({
        anio: Number(item.anio),
        moneda: item.moneda,
        cantidad_facturas: Number(item.cantidad_facturas),
        total_importe: Number(item.total_importe),
      }));

      return NextResponse.json(serializableData);
    } catch (error) {
      console.error("Error al obtener resumen de facturación:", error);
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
