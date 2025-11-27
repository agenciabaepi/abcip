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

        {/* Header Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-archivo text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Publicações
              </h2>
              <p className="font-archivo text-lg md:text-xl lg:text-2xl font-light text-gray-600 max-w-4xl mx-auto">
                Acesse e saiba mais sobre o mercado em nossas publicações exclusivas.
              </p>
            </div>

            {/* Grid de Publicações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
              {/* Publicação 1 */}
              <div className="flex flex-col">
                <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="/imagens/publicacao-1.png"
                    alt="Levantamento mostra vigor na expansão"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-archivo text-xl md:text-2xl font-bold text-gray-900 mb-4 uppercase">
                  LEVANTAMENTO MOSTRA VIGOR NA EXPANSÃO DA ILUMINAÇÃO PÚBLICA DE QUALIDADE NO PAÍS
                </h3>
                <p className="font-archivo text-base md:text-lg font-light text-gray-700 leading-relaxed">
                  Mais de 57 milhões de brasileiros, ou seja, 27% da população, vêm sendo beneficiados com iluminação pública de melhor qualidade graças à modernização dos parques municipais de IP por meio da parceria público-privada. Hoje, 146 contratos de PPP no valor de R$ 32 bilhões permite a implantação de 5 milhões de pontos de luz de tecnologia LED em 173 municípios, reduzindo drasticamente o consumo de energia, aumentando a segurança pública e mobilidade, permitindo a ocupação dos espaços públicos no período noturno.
                </p>
              </div>

              {/* Publicação 2 */}
              <div className="flex flex-col">
                <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="/imagens/publicacao-2.jpeg"
                    alt="Panorama Setorial 2024"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-archivo text-xl md:text-2xl font-bold text-gray-900 mb-4 uppercase">
                  PANORAMA SETORIAL DA ILUMINAÇÃO PÚBLICA PRIVADA 2024
                </h3>
                <p className="font-archivo text-base md:text-lg font-light text-gray-700 leading-relaxed">
                  Hoje 138 municípios brasileiros estão modernizando seus parques de iluminação por meio da concessão dos serviços para empresas privadas, beneficiando 52 milhões de habitantes. Os 116 contratos no valor de R$ 27 bilhões permitirão a implantação de 4,2 milhões de pontos de luz de tecnologia LED, reduzindo drasticamente o consumo de energia, melhorando a qualidade de vida da população em termos de conforto, ocupação dos espaços públicos no período da noite, de segurança pública e mobilidade.
                </p>
              </div>

              {/* Publicação 3 */}
              <div className="flex flex-col">
                <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="/imagens/publicacao-3.jpeg"
                    alt="Guia da Telegestão"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-archivo text-xl md:text-2xl font-bold text-gray-900 mb-4 uppercase">
                  EDIÇÃO ATUALIZA ESPECIFICAÇÕES TÉCNICAS PARA A TELEGESTÃO DAS REDES DE IP
                </h3>
                <p className="font-archivo text-base md:text-lg font-light text-gray-700 leading-relaxed">
                  A terceira edição do Guia da Telegestão na Iluminação Pública, da ABCIP, inclui informações sobre a telegestão no contexto das cidades inteligentes e da iluminação adaptativa (dimerização). Elaborado com a colaboração de profissionais de 16 empresas associadas à ABCIP, a publicação é um guia essencial para gestores públicos e estruturadores de projetos de Parcerias Público-Privadas (PPP).
                </p>
              </div>

              {/* Publicação 4 */}
              <div className="flex flex-col">
                <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="/imagens/publicacao-4.jpeg"
                    alt="Estudo dimensiona parque nacional"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-archivo text-xl md:text-2xl font-bold text-gray-900 mb-4 uppercase">
                  ESTUDO INÉDITO DIMENSIONA O PARQUE NACIONAL DE ILUMINAÇÃO
                </h3>
                <p className="font-archivo text-base md:text-lg font-light text-gray-700 leading-relaxed">
                  O Brasil tem hoje mais de 22 milhões de pontos de iluminação pública (IP) instalados nos parques dos municípios, que consomem em média 14.500 GWH de energia. Desse total de pontos de IP, apenas 19,6% das luminárias usam tecnologia LED, a mais eficiente. O potencial de eficiência energética e de redução de CO2 emitido na atmosfera com a modernização dos parques de IP utilizando a tecnologia LED pode proporcionar uma economia de energia elétrica entre 40 e 70% em relação às tecnologias anteriores.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

