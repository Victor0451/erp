import { auth } from "@/auth";
import { DashboardContainer } from "@/components/dashboard-container";


export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }



  return (
    <DashboardContainer />
  );
}
