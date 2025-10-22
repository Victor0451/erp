import { auth } from "@/auth";
import AdminContainer from "@/components/admin-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader className="flex flex-row items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <CardTitle>Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No tienes los permisos necesarios para acceder a esta sección.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-5">
        Administración
      </h2>
      <AdminContainer />
    </div>
  );
}
