import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import AuthProvider from "@/components/auth-provider";

import { Theme } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema E.R.P.",
  description: "Sistema de gestion integral para tu negocio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Theme>{children}</Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
