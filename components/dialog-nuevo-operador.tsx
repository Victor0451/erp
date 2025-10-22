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

const operadorSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export function DialogoNuevoOperador({ traerDatos }: MyComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof operadorSchema>>({
    resolver: zodResolver(operadorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const regDatos = async (values: z.infer<typeof operadorSchema>) => {
    const postData = {
      ...values,
      f: "reg operador",
    };

    try {
      const response = await fetch("/api/operadores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        showToast.success("Operador Registrado");
        traerDatos();
        form.reset();
        // Aquí podrías cerrar el diálogo si lo deseas
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Ocurrió un error al registrar el operador");
        showToast.error(errorData.error || "Ocurrió un error");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Error de conexión al registrar el operador.");
    }
  };

  async function onSubmit(values: z.infer<typeof operadorSchema>) {
    setError(null);
    startTransition(() => {
      regDatos(values);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">Nuevo Operador</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Operador</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo operador. Se le asignará el rol de 'Operador' por defecto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
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
              name="email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Registrando..." : "Registrar Operador"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}