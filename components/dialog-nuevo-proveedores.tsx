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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { proveedorSchema } from "../lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify";

interface MyComponentProps {
  traerDatos: () => void;
  proveedorToEdit?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialgoNuevoProveedor({ traerDatos, proveedorToEdit, open, onOpenChange }: MyComponentProps) {
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof proveedorSchema>>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      proveedor: "",
      clave_tributaria: "",
      tipo_clave: undefined,
      domicilio: "",
      telefono: 0,
      observacion: "",
    },
  });

  useEffect(() => {
    if (proveedorToEdit) {
      form.reset({
        proveedor: proveedorToEdit.proveedor,
        clave_tributaria: proveedorToEdit.clave_tributaria,
        tipo_clave: proveedorToEdit.tipo_clave,
        domicilio: proveedorToEdit.domicilio,
        telefono: Number(proveedorToEdit.telefono),
        observacion: proveedorToEdit.observacion || "",
      });
    } else {
      form.reset({
        proveedor: "",
        clave_tributaria: "",
        tipo_clave: undefined,
        domicilio: "",
        telefono: 0,
        observacion: "",
      });
    }
  }, [proveedorToEdit, form]);

  const regDatos = async (values: z.infer<typeof proveedorSchema>) => {
    const postData = {
      proveedor: values.proveedor,
      clave_tributaria: values.clave_tributaria,
      tipo_clave: values.tipo_clave,
      domicilio: values.domicilio,
      telefono: values.telefono,
      observacion: values.observacion,
      f: "reg proveedor",
    };

    try {
      const response = await fetch("/api/proveedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("proveedor Registrado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al registrar al proveedor", {
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

  const actDatos = async (values: z.infer<typeof proveedorSchema>) => {
    const postData = {
      proveedor: values.proveedor,
      clave_tributaria: values.clave_tributaria,
      tipo_clave: values.tipo_clave,
      domicilio: values.domicilio,
      telefono: values.telefono,
      observacion: values.observacion,
      idproveedor: proveedorToEdit.idproveedor,
      f: "act proveedor",
    };

    try {
      const response = await fetch("/api/proveedores", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("Proveedor Actualizado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al actualizar el proveedor", {
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

  async function onSubmit(values: z.infer<typeof proveedorSchema>) {
    setError(null);
    startTransition(async () => {
      if (proveedorToEdit) {
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
          <Button variant="outline">Nuevo Proveedor</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[1200px] ">
        <DialogHeader>
          <DialogTitle>{proveedorToEdit ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
          <DialogDescription>
            {proveedorToEdit ? "Modifica los datos del proveedor." : "Ingresa los datos del nuevo proveedor."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="proveedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proveedor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Proveedor"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full md:w-1/4 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="clave_tributaria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clave Tributaria (CUIT/CUIL)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="N° CUIT/CUIL"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="tipo_clave"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿CUIT o CUIL?</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="CUIT/CUIL" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CUIT">CUIT</SelectItem>
                              <SelectItem value="CUIL">CUIL</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value?.toString() ?? ""}
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
                    name="domicilio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domicilio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Domicilio"
                            type="text"
                            {...field}
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
                            placeholder="Observacion"
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

                <Button type="submit">{proveedorToEdit ? "Actualizar" : "Registrar"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
