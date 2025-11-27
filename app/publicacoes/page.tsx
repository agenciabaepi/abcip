import { Metadata } from "next";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Publicações ABCIP",
  description: "Publicações e materiais da ABCIP",
};

export default function PublicacoesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-grow bg-white">
        {/* Banner da Página */}
        <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] min-h-[300px] w-full overflow-hidden">
          <Image
            src="/imagens/banner-publicacoes.jpg"
            alt="Banner Publicações"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Section */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="font-archivo text-lg text-gray-600">
                Em breve, conteúdo de publicações será adicionado aqui.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

