import FormLogin from "@/components/form-login";

interface SearchPageProps {
  searchParams: Promise<{
    verified?: string | undefined;
    error?: string | undefined;
  }>; // ✅ searchParams as a Promise
}

export default async function LoginPage({ searchParams }: SearchPageProps) {
  const { verified, error } = await searchParams;
  const isVerified = verified === "true";
  const OAuthAccountNotLinked = error === "OAuthAccountNotLinked";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <FormLogin
        isVerified={isVerified}
        OAuthAccountNotLinked={OAuthAccountNotLinked}
      />
    </div>
  );
}
