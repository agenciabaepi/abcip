import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publicações ABCIP",
  description: "Publicações e materiais da ABCIP",
};

export default function PublicacoesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-archivo text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Publicações ABCIP
          </h1>
          <p className="font-archivo text-lg md:text-xl lg:text-2xl font-light text-gray-300 max-w-3xl">
            Conheça nossas publicações e saiba mais sobre o mercado.
          </p>
        </div>
      </section>

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
    </div>
  );
}

