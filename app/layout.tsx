import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Syne, Azeret_Mono } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret-mono",
  display: "swap",
});

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
    <html lang="pt-BR" className={`${syne.variable} ${azeretMono.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

