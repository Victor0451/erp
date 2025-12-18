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
import { productoSchema } from "../lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MyComponentProps {
  traerDatos: () => void;
  productoToEdit?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialgoNuevaProducto({ traerDatos, productoToEdit, open, onOpenChange }: MyComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [categorias, saveCategorias] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof productoSchema>>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      producto: "",
      alta: new Date(),
      unidad: undefined,
      moneda: undefined,
      stock: 0,
      idcategoria: undefined,
      observacion: "",
      precio_unitario: 0,
    },
  });

  useEffect(() => {
    if (productoToEdit) {
      form.reset({
        producto: productoToEdit.producto,
        alta: new Date(productoToEdit.alta),
        unidad: productoToEdit.unidad,
        moneda: productoToEdit.moneda,
        stock: Number(productoToEdit.stock),
        idcategoria: Number(productoToEdit.idcategoria),
        observacion: productoToEdit.observacion || "",
        precio_unitario: Number(productoToEdit.precio_unitario),
      });
    } else {
      form.reset({
        producto: "",
        alta: new Date(),
        unidad: undefined,
        moneda: undefined,
        stock: 0,
        idcategoria: undefined,
        observacion: "",
        precio_unitario: 0,
      });
    }
  }, [productoToEdit, form]);

  const traerCategorias = async () => {
    const getRows = await fetch(`/api/categorias?f=traer%20categorias`);
    const rawText = await getRows.text();
    try {
      const data = JSON.parse(rawText);

      saveCategorias(data);
    } catch (error) {
      console.error("Error parsing JSON:", error, rawText);
    }
  };

  const regDatos = async (values: z.infer<typeof productoSchema>) => {
    const postData = {
      producto: values.producto,
      alta: values.alta,
      unidad: values.unidad,
      moneda: values.moneda,
      stock: values.stock,
      idcategoria: values.idcategoria,
      observacion: values.observacion,
      precio_unitario: values.precio_unitario,
      f: "reg producto",
    };

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("Producto Registrado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al registrar la producto", {
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

  const actDatos = async (values: z.infer<typeof productoSchema>) => {
    const postData = {
      producto: values.producto,
      alta: values.alta,
      unidad: values.unidad,
      moneda: values.moneda,
      stock: values.stock,
      idcategoria: values.idcategoria,
      observacion: values.observacion,
      precio_unitario: values.precio_unitario,
      idproducto: productoToEdit.idproducto,
      f: "act producto",
    };

    try {
      const response = await fetch("/api/productos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("Producto Actualizado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al actualizar la producto", {
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

  async function onSubmit(values: z.infer<typeof productoSchema>) {
    setError(null);
    startTransition(async () => {
      if (productoToEdit) {
        await actDatos(values);
      } else {
        await regDatos(values);
      }
    });
  }

  useEffect(() => {
    traerCategorias();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="outline">Nuevo Producto</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[1200px] ">
        <DialogHeader>
          <DialogTitle>{productoToEdit ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {productoToEdit ? "Modifica los datos del producto." : "Ingresa los datos del nuevo producto."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="idcategoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Select
                            key={`categoria-${field.value || 'new'}`}
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value ? field.value.toString() : ""}
                            defaultValue={field.value ? field.value.toString() : ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categorias.map((c, index) => (
                                <SelectItem
                                  key={index}
                                  value={c.idcategoria.toString()}
                                >
                                  {c.categoria.toString()}
                                </SelectItem>
                              ))}
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
                    name="moneda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda</FormLabel>
                        <FormControl>
                          <Select
                            key={`moneda-${field.value || 'new'}`}
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value || ""}
                            defaultValue={field.value || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Moneda" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pesos">Pesos</SelectItem>
                              <SelectItem value="Dolares">Dolares</SelectItem>
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
                    name="unidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidad</FormLabel>
                        <FormControl>
                          <Select
                            key={`unidad-${field.value || 'new'}`}
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value || ""}
                            defaultValue={field.value || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Unidad de medida" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                              <SelectItem value="lts">Litros (lts)</SelectItem>
                              <SelectItem value="unidades">Unidades</SelectItem>
                              <SelectItem value="cajas">Cajas</SelectItem>
                              <SelectItem value="metros">Metros (m)</SelectItem>
                              <SelectItem value="paquetes">Paquetes</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="producto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Producto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Producto"
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
                    name="alta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Alta</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fecha de alta"
                            type="date"
                            {...field}
                            value={
                              field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : field.value
                            }
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
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
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
                <div className="w-full md:w-1/5 px-3 mt-6 mb-6 md:mb-0">
                  <FormField
                    control={form.control}
                    name="precio_unitario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Unitario</FormLabel>
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
                <div className="w-full md:w-1/2 px-3 mt-6 mb-6 md:mb-0">
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

                <Button type="submit">{productoToEdit ? "Actualizar" : "Registrar"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
