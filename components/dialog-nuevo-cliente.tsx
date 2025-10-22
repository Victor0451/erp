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
import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "nextjs-toast-notify";

interface MyComponentProps {
  traerDatos: () => void;
}

const clienteSchema = z.object({
  cliente: z.string().min(1, { message: "El nombre del cliente es requerido." }),
  dni: z.coerce.number().positive({ message: "El DNI debe ser un número positivo." }),
  calle: z.string().min(1, { message: "La calle es requerida." }),
  numero: z.coerce.number().positive({ message: "El número debe ser positivo." }),
  barrio: z.string().min(1, { message: "El barrio es requerido." }),
  telefono: z.coerce.number().positive({ message: "El teléfono debe ser un número positivo." }),
  mail: z.string().email({ message: "Email inválido." }),
});

export function DialogoNuevoCliente({ traerDatos }: MyComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof clienteSchema>>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      cliente: "",
      dni: 0,
      calle: "",
      numero: 0,
      barrio: "",
      telefono: 0,
      mail: "",
    },
  });

  const regDatos = async (values: z.infer<typeof clienteSchema>) => {
    const postData = {
      ...values,
      f: "reg cliente",
    };

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        showToast.success("Cliente Registrado", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });
        traerDatos();
        form.reset();
        // Consider closing the dialog here
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Ocurrió un error al registrar el cliente");
        showToast.error(errorData.error || "Ocurrió un error al registrar el cliente", {
          duration: 4000,
          position: "top-right",
          transition: "fadeIn",
          sound: true,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Error de conexión al registrar el cliente.");
    }
  };

  async function onSubmit(values: z.infer<typeof clienteSchema>) {
    setError(null);
    startTransition(() => {
      regDatos(values);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Nuevo Cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo cliente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre y Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="DNI"
                        {...field}
                        value={field.value ?? ""} />
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
                        placeholder="Teléfono"
                        {...field}
                        value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calle</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Número"
                        {...field}
                        value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barrio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barrio</FormLabel>
                    <FormControl>
                      <Input placeholder="Barrio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Registrando..." : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}