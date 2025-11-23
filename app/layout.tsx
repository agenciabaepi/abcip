import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ABCIP - Concessionária de Iluminação Pública",
  description: "ABCIP - Concessionária de Iluminação Pública",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased" style={{ fontFamily: 'Arial, sans-serif' }}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

