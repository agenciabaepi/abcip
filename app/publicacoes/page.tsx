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
          {/* Imagem de fundo do banner - pode ser configurável depois */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="font-archivo text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
                Publicações ABCIP
              </h1>
              <p className="font-archivo text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-300 max-w-3xl mx-auto">
                Conheça nossas publicações e saiba mais sobre o mercado.
              </p>
            </div>
          </div>
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

