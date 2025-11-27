import { Metadata } from "next";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Download } from "lucide-react";

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
              {publicacoes.map((pub) => (
                <div key={pub.id} className="flex flex-col">
                  {pub.image_url && (
                    <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-lg">
                      <Image
                        src={pub.image_url}
                        alt={pub.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className="font-archivo text-xl md:text-2xl font-bold text-gray-900 mb-4 uppercase">
                    {pub.title}
                  </h3>
                  
                  {pub.description && (
                    <p className="font-archivo text-base md:text-lg font-light text-gray-700 leading-relaxed mb-4">
                      {pub.description}
                    </p>
                  )}

                  {pub.file_url && (
                    <a
                      href={pub.file_url}
                      download={pub.file_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-archivo font-medium transition-colors mt-auto"
                    >
                      <Download className="w-5 h-5" />
                      Baixar Publicação
                    </a>
                  )}
                </div>
              ))}

              {publicacoes.length === 0 && (
                <div className="col-span-2 text-center py-12">
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

