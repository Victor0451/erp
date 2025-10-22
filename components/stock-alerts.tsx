import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Package } from "lucide-react";

export function StockAlerts({ stockAlerts }: { stockAlerts: any[] | null }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Alerta de Stock Bajo</CardTitle>
        <CardDescription>
          Productos con 5 o menos unidades en stock.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
            {stockAlerts && stockAlerts.length > 0 ? (
                stockAlerts.map((item) => (
                    <div key={item.idproducto} className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                            <Package className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{item.producto}</p>
                        </div>
                        <div className="ml-auto font-medium text-red-500">{item.stock} unidades</div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">No hay productos con stock bajo.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}