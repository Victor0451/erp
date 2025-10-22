"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerfilEmpresaForm } from "./perfil-empresa-form";
import { TablaOperadores } from "./table-operadores";
import { Building, Settings, Users } from "lucide-react";

export default function AdminContainer() {
  return (
    <Tabs defaultValue="operadores" className="space-y-4">
      <TabsList>
        <TabsTrigger value="operadores">
          <Users className="mr-2 h-4 w-4" />
          Operadores
        </TabsTrigger>
        <TabsTrigger value="perfil">
          <Building className="mr-2 h-4 w-4" />
          Perfil de la Empresa
        </TabsTrigger>
        <TabsTrigger value="configuracion" disabled>
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </TabsTrigger>
      </TabsList>
      <TabsContent value="operadores" className="space-y-4"><TablaOperadores /></TabsContent>
      <TabsContent value="perfil" className="space-y-4"><PerfilEmpresaForm /></TabsContent>
    </Tabs>
  );
}