import { TablaCategorias } from "@/components/table-categorias";

import React from "react";

export default async function Page() {
  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
        Categorias
      </h2>
      <TablaCategorias />
    </div>
  );
}
