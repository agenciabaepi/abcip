import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import AssociadosCTA from "@/components/AssociadosCTA";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function ContatoPage() {
  let settings: any = null;
  let associadosSettings: any = null;

  try {
    const supabase = await createClient();
    const [contatoRes, associadosRes] = await Promise.all([
      supabase.from("contato_page_settings").select("*").single(),
      supabase.from("associados_page_settings").select("*").single(),
    ]);
    settings = contatoRes.data;
    associadosSettings = associadosRes.data;
  } catch (error) {
    console.warn("Erro ao carregar configurações:", error);
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
              alt="Banner Contato"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center tracking-tight">
            Fale Conosco
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Formulário à esquerda - Fundo cinza claro */}
            <ContactForm />

            {/* Informações à direita */}
            <ContactInfo />
          </div>
        </div>
      </main>

      {/* CTA Section - Mesmo CTA da página de associados */}
      {associadosSettings?.cta_active && associadosSettings?.cta_description && (
        <AssociadosCTA
          title={associadosSettings.cta_title || ""}
          description={associadosSettings.cta_description}
          buttonText={associadosSettings.cta_button_text || "Faça Parte"}
          buttonLink={associadosSettings.cta_button_link}
          imageUrl={associadosSettings.cta_image_url}
        />
      )}

      <Footer />
    </div>
  );
}

