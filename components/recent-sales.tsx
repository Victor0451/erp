import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

export function RecentSales({ ventasRecientes }: { ventasRecientes: any }) {
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "NN"; // No Name
    const nameParts = name.split(" ").filter(Boolean);
    if (nameParts.length === 0) return "NN";
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="space-y-8">
      {ventasRecientes && ventasRecientes.length > 0 ? (
        ventasRecientes.map((venta: any) => (
          <div key={venta.idventa} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>{getInitials(venta.cliente)}</AvatarFallback>
            </Avatar>

            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {" "}
                {venta.cliente}
              </p>
              <p className="text-sm text-muted-foreground">{venta.mail}</p>
              <p className="text-sm text-muted-foreground">
                {moment(venta.fecha).format("DD/MM/YYYY")}
              </p>
            </div>
            <div className="ml-auto font-medium">${venta.importe}</div>
          </div>
        ))
      ) : (
        <p>No hay ventas recientes.</p>
      )}
    </div>
  );
}
