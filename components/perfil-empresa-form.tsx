"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify"; // Asegúrate de que tenantSchema esté importado
import { tenantSchema } from "@/lib/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function PerfilEmpresaForm() {
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof tenantSchema>>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      empresa: "",
      razon_social: "",
      cuit_cuil: "",
      direccion: "",
      telefono: 0,
      email: "",
      ubicacion: "",
    },
  });



  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const response = await fetch("/api/tenant");
        if (response.ok) {
          const data = await response.json();
          console.log("Datos del tenant obtenidos:", data);
          if (data) {
            // Usar form.reset para actualizar todos los valores del formulario
            form.reset(data);
          }
        } else {
          console.error("Error al obtener los datos de la empresa.");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };
    if (session) {
      fetchTenantData();
    }
  }, [session, form]);

  const handleUpdate = async (values: z.infer<typeof tenantSchema>) => {
    try {
      const response = await fetch("/api/tenant", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        showToast.success("Perfil de la empresa actualizado.");
        // Actualiza la sesión para reflejar el nuevo nombre sin recargar la página
        await update({ tenantName: values.empresa });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Ocurrió un error al actualizar el perfil.");
        showToast.error(errorData.error || "Ocurrió un error.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Error de conexión al actualizar el perfil.");
    }
  };

  async function onSubmit(values: z.infer<typeof tenantSchema>) {
    setError(null);
    startTransition(() => {
      handleUpdate(values);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de la Empresa</CardTitle>
        <CardDescription>
          Actualiza el nombre de tu empresa. Este nombre será visible para todos los operadores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Fantasía</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de tu empresa" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="razon_social"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razón Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Razón Social S.A." {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuit_cuil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CUIT / CUIL</FormLabel>
                    <FormControl>
                      <Input placeholder="00-00000000-0" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3794000000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de Contacto</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contacto@empresa.com" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle Falsa 123" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ubicacion"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Ubicación (Ciudad, Provincia, País)</FormLabel>
                    <FormControl>
                      <Input placeholder="Corrientes, Corrientes, Argentina" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}