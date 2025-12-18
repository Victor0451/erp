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
import { categoriaSchema } from "../lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify";

interface MyComponentProps {
  traerDatos: () => void;
  categoriaToEdit?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialgoNuevaCategoria({ traerDatos, categoriaToEdit, open, onOpenChange }: MyComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof categoriaSchema>>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      categoria: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (categoriaToEdit) {
      form.reset({
        categoria: categoriaToEdit.categoria,
        descripcion: categoriaToEdit.descripcion,
      });
    } else {
      form.reset({
        categoria: "",
        descripcion: "",
      });
    }
  }, [categoriaToEdit, form]);

  const regCategoria = async (values: z.infer<typeof categoriaSchema>) => {
    const postData = {
      categoria: values.categoria,
      descripcion: values.descripcion,
      f: "reg categoria",
    };

    try {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("Categoria Registrada", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al registrar la categoria", {
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

  const actCategoria = async (values: z.infer<typeof categoriaSchema>) => {
    const postData = {
      categoria: values.categoria,
      descripcion: values.descripcion,
      idcategoria: categoriaToEdit.idcategoria,
      f: "act categoria",
    };

    try {
      const response = await fetch("/api/categorias", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 200) {
        showToast.success("Categoria Actualizada", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });

        traerDatos();
        form.reset();
        if (onOpenChange) onOpenChange(false);
      } else if (response.status === 500) {
        showToast.error("Ocurrio un error al actualizar la categoria", {
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

  async function onSubmit(values: z.infer<typeof categoriaSchema>) {
    setError(null);
    startTransition(async () => {
      if (categoriaToEdit) {
        await actCategoria(values);
      } else {
        await regCategoria(values);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="outline">Nueva Categoria</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{categoriaToEdit ? "Editar Categoria" : "Nueva Categoria"}</DialogTitle>
          <DialogDescription>
            {categoriaToEdit ? "Modifica los datos de la categoria." : "Ingresa los datos de la nueva categoria."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Categoria" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripcion</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Descripcion"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && <FormMessage>{error}</FormMessage>}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>

                <Button type="submit">{categoriaToEdit ? "Actualizar" : "Registrar"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
