import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Syne, Azeret_Mono, Archivo } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["100", "300", "500", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ABCIP",
  description: "ABCIP - Associação Brasileira das Concessionárias de Iluminação Pública e Cidades Inteligentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${archivo.variable} ${azeretMono.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

