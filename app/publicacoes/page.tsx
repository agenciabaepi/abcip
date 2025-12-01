import { Metadata } from "next";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Publicações ABCIP",
  description: "Publicações e materiais da ABCIP",
};

export default async function PublicacoesPage() {
  let settings: any = null;
  let publicacoes: any[] = [];

  try {
    const supabase = await createClient();
    const [settingsRes, publicacoesRes] = await Promise.all([
      supabase.from("publicacoes_page_settings").select("*").single(),
      supabase
        .from("publicacoes")
        .select("*")
        .eq("active", true)
        .order("order", { ascending: true }),
    ]);

    settings = settingsRes.data;
    publicacoes = publicacoesRes.data || [];
  } catch (error) {
    console.error("Erro ao carregar publicações:", error);
  }
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-grow bg-white">
        {/* Banner da Página */}
        {settings?.banner_image_url && (
          <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] min-h-[300px] w-full overflow-hidden">
            <Image
              src={settings.banner_image_url}
              alt="Banner Publicações"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-archivo text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Publicações
              </h2>
              <p className="font-archivo text-lg md:text-xl lg:text-2xl font-light text-gray-600 max-w-4xl mx-auto">
                Acesse e saiba mais sobre o mercado em nossas publicações exclusivas.
              </p>
            </div>

            {/* Grid de Publicações */}
            <div className="space-y-8 md:space-y-10 lg:space-y-12">
              {publicacoes.map((pub) => (
                <div key={pub.id} className="flex flex-col md:flex-row gap-0 bg-white rounded-lg overflow-hidden shadow-md">
                  {/* Imagem à esquerda - QUADRADA */}
                  {pub.image_url && (
                    <div className="relative w-full md:w-[450px] md:h-[450px] flex-shrink-0 overflow-hidden">
                      {pub.file_url ? (
                        <a
                          href={pub.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                        >
                          <img
                            src={pub.image_url}
                            alt={pub.title}
                            className="w-full h-full object-cover"
                            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </a>
                      ) : (
                        <img
                          src={pub.image_url}
                          alt={pub.title}
                          className="w-full h-full object-cover"
                          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Conteúdo à direita - FUNDO CINZA CLARO - MESMA ALTURA DA IMAGEM */}
                  <div className="flex flex-col justify-center flex-1 p-6 md:p-8 lg:p-10 bg-gray-100 md:h-[450px]">
                    {pub.file_url ? (
                      <h3 className="font-archivo text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-4 uppercase leading-tight">
                        <a
                          href={pub.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary-500 transition-colors"
                        >
                          {pub.title}
                        </a>
                      </h3>
                    ) : (
                      <h3 className="font-archivo text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-4 uppercase leading-tight">
                        {pub.title}
                      </h3>
                    )}
                    
                    {pub.description && (
                      <p className="font-archivo font-thin text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed text-justify">
                        {pub.file_url ? (
                          <a
                            href={pub.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-500 transition-colors"
                          >
                            {pub.description}
                          </a>
                        ) : (
                          pub.description
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {publicacoes.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-archivo text-lg text-gray-500">
                    Nenhuma publicação disponível no momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

