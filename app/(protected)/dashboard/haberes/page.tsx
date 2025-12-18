import { TablaEmpleados } from "@/components/table-empleados";
import { TablaHaberes } from "@/components/table-haberes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export default async function Page() {
    return (
        <div>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
                Gestión de Haberes
            </h2>

            <Tabs defaultValue="empleados" className="w-full">
                <TabsList>
                    <TabsTrigger value="empleados">Empleados</TabsTrigger>
                    <TabsTrigger value="haberes">Liquidación de Haberes</TabsTrigger>
                </TabsList>
                <TabsContent value="empleados">
                    <TablaEmpleados />
                </TabsContent>
                <TabsContent value="haberes">
                    <TablaHaberes />
                </TabsContent>
            </Tabs>
        </div>
    );
}
