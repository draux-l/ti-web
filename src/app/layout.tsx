import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthInitializer } from "@/components/guards/AuthInitializer";
import { ServerDownBanner } from "@/components/ServerDownBanner";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Tecsup Inmersivo",
  description: "Ecosistema educativo híbrido Tecsup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </LanguageProvider>
        <Toaster />
        <ServerDownBanner />
      </body>
    </html>
  );
}
