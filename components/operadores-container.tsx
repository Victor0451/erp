"use client";

import React from "react";
import { TablaOperadores } from "./table-operadores";

export default function OperadoresContainer() {
  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
        Gestión de Operadores
      </h2>

      <div className="mt-5 border-2 rounded-xl p-4">
        <TablaOperadores />
      </div>
    </div>
  );
}