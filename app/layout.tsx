import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureAuth — Autenticação Segura",
  description:
    "Sistema de autenticação seguro construído com Next.js e Supabase. Registro, login protegido e painel administrativo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
