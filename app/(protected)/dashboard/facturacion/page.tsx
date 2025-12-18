import { TablaFacturacion } from "@/components/table-facturacion";
import React from "react";

export default async function Page() {
    return (
        <div>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
                Facturación
            </h2>
            <TablaFacturacion />
        </div>
    );
}
