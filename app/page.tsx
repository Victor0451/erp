import { Button } from "@/components/ui/button";
import { Boxes, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Potencia tu Negocio con Nuestro Sistema ERP
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Una solución integral para gestionar ventas, compras, inventario
                y más. Optimiza tus operaciones y toma decisiones inteligentes.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Ir al Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                Características Clave
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Todo lo que necesitas para crecer
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nuestro ERP está diseñado para simplificar la complejidad de la
                gestión empresarial.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="grid gap-1 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                <Boxes className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Gestión de Inventario</h3>
              <p className="text-sm text-muted-foreground">
                Controla tu stock en tiempo real, gestiona productos y evita quiebres de inventario.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Módulo de Ventas</h3>
              <p className="text-sm text-muted-foreground">
                Registra ventas de forma sencilla, actualizando automáticamente tu inventario.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Control de Compras</h3>
              <p className="text-sm text-muted-foreground">
                Administra tus compras a proveedores y mantén tu stock siempre al día.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default HomePage;
