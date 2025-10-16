import { auth } from "@/auth";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { CreditCard, DollarSign, Package, ShoppingCart } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const totalProductos = await db.productos.count();
  const totalProveedores = await db.proveedores.count();

  const ventas = await db.ventas.findMany({
    select: {
      importe: true,
    },
  });

  const totalVentas = ventas.length;
  const ingresosTotales = ventas.reduce(
    (acc, venta) => acc + (venta.importe ?? 0),
    0
  );

  const compras = await db.compras.findMany({
    select: {
      importe: true,
    },
  });
  const gastosTotales = compras.reduce(
    (acc, compra) => acc + (compra.importe ?? 0),
    0
  );

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
        Panel de Control
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value={`$${ingresosTotales.toLocaleString("es-AR")}`}
          description="+20.1% desde el mes pasado"
          icon={DollarSign}
        />
        <StatCard
          title="Ventas"
          value={`+${totalVentas}`}
          description="+180.1% desde el mes pasado"
          icon={CreditCard}
        />
        <StatCard
          title="Compras"
          value={`$${gastosTotales.toLocaleString("es-AR")}`}
          description="+19% desde el mes pasado"
          icon={ShoppingCart}
        />
        <StatCard
          title="Productos Activos"
          value={totalProductos.toString()}
          description="+201 desde la última hora"
          icon={Package}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>
              Se realizaron {totalVentas} ventas este mes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
