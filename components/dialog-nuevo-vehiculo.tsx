import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { vehiculoSchema } from "../lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify";

interface MyComponentProps {
  traerDatos: () => void;
  vehiculoToEdit?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialgoNuevoVehiculo({ traerDatos, vehiculoToEdit, open, onOpenChange }: MyComponentProps) {
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof vehiculoSchema>>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      vehiculo: "",
      patente: "",
      modelo: 0,
      observacion: "",
    },
  });

  useEffect(() => {
    if (vehiculoToEdit) {
      form.reset({
        vehiculo: vehiculoToEdit.vehiculo,
        patente: vehiculoToEdit.patente,
        modelo: Number(vehiculoToEdit.modelo),
        observacion: vehiculoToEdit.observacion,
      });
    } else {
      form.reset({
        vehiculo: "",
        patente: "",
        modelo: 0,
        observacion: "",
      });
    }
  }, [vehiculoToEdit, form]);

  const regDatos = async (values: z.infer<typeof vehiculoSchema>) => {
    const postData = {
      vehiculo: values.vehiculo,
      patente: values.patente,
      modelo: values.modelo,
      observacion: values.observacion,
      f: "reg vehiculo",
    };


    try {
      const response = await fetch("/api/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("Vehiculo Registrado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al registrar al vehiculo", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const actDatos = async (values: z.infer<typeof vehiculoSchema>) => {
    const postData = {
      vehiculo: values.vehiculo,
      patente: values.patente,
      modelo: values.modelo,
      observacion: values.observacion,
      idvehiculo: vehiculoToEdit.idvehiculo,
      f: "act vehiculo",
    };


    try {
      const response = await fetch("/api/vehiculos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("Vehiculo Actualizado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al actualizar al vehiculo", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof vehiculoSchema>) {
    setError(null);
    startTransition(async () => {
      if (vehiculoToEdit) {
        await actDatos(values);
      } else {
        await regDatos(values);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="outline">Nuevo Vehiculo</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[1200px] ">
        <DialogHeader>
          <DialogTitle>{vehiculoToEdit ? "Editar Vehiculo" : "Nuevo Vehiculo"}</DialogTitle>
          <DialogDescription>
            {vehiculoToEdit ? "Modifica los datos del vehiculo." : "Ingresa los datos del nuevo vehiculo."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="vehiculo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehiculo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="vehiculo"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="patente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patente</FormLabel>
                        <FormControl>
                          <Input placeholder="patente" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full md:w-full px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="observacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observacion</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="observacion"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {error && <FormMessage>{error}</FormMessage>}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>

                <Button type="submit">{vehiculoToEdit ? "Actualizar" : "Registrar"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
