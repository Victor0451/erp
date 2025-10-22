"use client";

import React, { useCallback, useState } from "react";
import { TablaVentas } from "@/components/table-ventas";
import { TablaVentasRealizadas } from "@/components/table-ventas-realizadas";

export default function VentasContainer() {
  const [refreshVentasRealizadas, setRefreshVentasRealizadas] = useState(false);

  const handleVentaChange = useCallback(() => {
    setRefreshVentasRealizadas((prev) => !prev);
    // También refrescamos los productos para actualizar el stock
    // al agregar o eliminar una venta.
  }, []);

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
        Ventas
      </h2>

      <div className="mt-5 border-2 rounded-xl p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
          Registrar Venta de Productos
        </h3>
        <TablaVentas
          onVentaAgregada={handleVentaChange}
          refresh={refreshVentasRealizadas}
        />
      </div>

      <hr className="my-5" />

      <div className="mt-5 border-2 rounded-xl p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
          Ventas Realizadas
        </h3>
        <TablaVentasRealizadas
          refresh={refreshVentasRealizadas}
          onVentaEliminada={handleVentaChange}
        />
      </div>
    </div>
  );
}
