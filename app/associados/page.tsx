import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import AssociadosCTA from "@/components/AssociadosCTA";
import { createClient } from "@/lib/supabase/server";
import { Associate } from "@/lib/types";
import Image from "next/image";

export default async function AssociadosPage() {
  let associates: Associate[] = [];
  let settings: any = null;

  try {
    const supabase = await createClient();
    const [associatesRes, settingsRes] = await Promise.all([
      supabase
        .from("associates")
        .select("*")
        .order("order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("associados_page_settings").select("*").single(),
    ]);
    
    associates = (associatesRes.data as Associate[]) || [];
    settings = settingsRes.data;
  } catch (error) {
    console.warn("Não foi possível carregar associados:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
        {/* Banner da Página */}
        {settings?.banner_image_url && (
          <div className="relative h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[35vh] min-h-[150px] sm:min-h-[200px] w-full overflow-hidden">
            <Image
              src={settings.banner_image_url}
              alt="Banner Associados"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Texto Descritivo */}
          <p className="text-center text-lg md:text-xl text-gray-600 mb-6">
            Conheça nossos associados. Juntos, conectamos cidades e iluminamos o futuro!
          </p>

          {/* Título */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 sm:mb-12 text-center tracking-tight">
            Associados
          </h1>

          {associates && associates.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
              {associates.map((associate) => (
                <div
                  key={associate.id}
                  className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-all"
                >
                  {associate.website ? (
                    <a
                      href={associate.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-32 sm:h-40 md:h-48 relative"
                    >
                      <Image
                        src={associate.logo_url}
                        alt={associate.name}
                        fill
                        className="object-contain"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-32 sm:h-40 md:h-48 relative">
                      <Image
                        src={associate.logo_url}
                        alt={associate.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum associado cadastrado ainda.</p>
            </div>
          )}
        </div>
      </main>

      {/* CTA Section - Fora do container principal */}
      {settings?.cta_active && settings?.cta_description && (
        <AssociadosCTA
          title={settings.cta_title || ""}
          description={settings.cta_description}
          buttonText={settings.cta_button_text || "Faça Parte"}
          buttonLink={settings.cta_button_link}
          imageUrl={settings.cta_image_url}
        />
      )}
      <Footer />
    </div>
  );
}

