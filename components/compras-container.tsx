"use client";

import React, { useCallback, useState } from "react";
import { TablaCompras } from "@/components/table-compras";
import { TablaComprasRealizadas } from "@/components/table-compras-realizadas";

export default function ComprasContainer() {
  const [refreshComprasRealizadas, setRefreshComprasRealizadas] =
    useState(false);

  const [refreshCompras, setRefreshCompras] = useState(false);

  const handleCompraAgregada = useCallback(() => {
    setRefreshComprasRealizadas((prev) => !prev);
  }, []);

  const handleCompraEliminada = useCallback(() => {
    setRefreshCompras((prev) => !prev);
  }, []);

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
        Compras
      </h2>

      <div className="mt-5 border-2 rounded-xl p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
          Listado de Productos
        </h3>

        <TablaCompras
          onCompraAgregada={handleCompraAgregada}
          refresh={refreshCompras}
        />
      </div>

      <hr />

      <div className="mt-5 border-2 rounded-xl p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
          Compras Realizadas
        </h3>

        <TablaComprasRealizadas
          refresh={refreshComprasRealizadas}
          onCompraEliminada={handleCompraEliminada}
        />
      </div>
    </div>
  );
}
