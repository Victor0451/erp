"use client";

import { loginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginAction } from "@/actions/auth-action";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FaGithub, FaGoogle } from "react-icons/fa6";
import ButtonSocial from "./button-social";

interface FormLoginProps {
  isVerified: boolean;
  OAuthAccountNotLinked: boolean;
}

const FormLogin = ({ isVerified, OAuthAccountNotLinked }: FormLoginProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerified && (
          <p className="text-center text-sm text-green-500 mb-4">
            Email verificado, ahora puedes iniciar sesión.
          </p>
        )}
        {OAuthAccountNotLinked && (
          <p className="text-center text-sm text-red-500 mb-4">
            Para confirmar tu identidad, inicia sesión con la misma cuenta que
            usaste originalmente.
          </p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tu@email.com"
                      type="email"
                      {...field}
                      disabled={isPending}
                    />
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
                    <Input
                      placeholder="******"
                      type="password"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O</span>
          </div>
        </div>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?, registrate ahora mismo.{" "}
            <a href="/register" className="text-primary hover:underline">
              Registrarte
            </a>
          </p>
        </CardFooter>

        {/* <div className="space-y-2">
          <ButtonSocial provider="github">
            <FaGithub className="mr-2 h-5 w-5" />
            <span>Continuar con Github</span>
          </ButtonSocial>
          <ButtonSocial provider="google">
            <FaGoogle className="mr-2 h-5 w-5" />
            <span>Continuar con Google</span>
          </ButtonSocial>
        </div> */}
      </CardContent>
    </Card>
  );
};
export default FormLogin;
