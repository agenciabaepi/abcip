import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import BannerSlider from "@/components/BannerSlider";
import PostCard from "@/components/PostCard";
import CTASection from "@/components/CTASection";
import VideoSection from "@/components/VideoSection";
import { createClient } from "@/lib/supabase/server";
import { Banner, Post, CTASection as CTASectionType, Video } from "@/lib/types";
import Link from "next/link";

export default async function Home() {
  let banners: Banner[] = [];
  let posts: Post[] = [];
  let cta: CTASectionType | null = null;
  let videos: Video[] = [];

  try {
    const supabase = await createClient();
    const { data: bannersData } = await supabase
      .from("banners")
      .select("*")
      .order("order", { ascending: true });

    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6);

    const { data: ctaData, error: ctaError } = await supabase
      .from("cta_section")
      .select("*")
      .eq("active", true)
      .limit(1);

    const { data: videosData } = await supabase
      .from("videos")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    banners = (bannersData as Banner[]) || [];
    posts = (postsData as Post[]) || [];
    cta = (ctaData && ctaData.length > 0 ? (ctaData[0] as CTASectionType) : null);
    videos = (videosData as Video[]) || [];
    
    // Debug: verificar se a CTA foi carregada
    if (cta) {
      console.log("CTA carregada com sucesso:", { id: cta.id, title: cta.title, active: cta.active });
    } else {
      console.log("Nenhuma CTA ativa encontrada. Verifique se há uma CTA marcada como ativa no banco de dados.");
    }
    
    if (ctaError) {
      console.warn("Erro ao carregar CTA:", ctaError);
    }
  } catch (error) {
    console.warn("Não foi possível carregar dados do Supabase:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow">
        <BannerSlider banners={banners} />

        {/* Seção de Últimas Notícias - Logo após o banner */}
        {posts && posts.length > 0 && (
          <section className="bg-white py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                    Últimas Notícias
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Fique por dentro das novidades e atualizações
                  </p>
                </div>
                <Link
                  href="/noticias"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm md:text-base text-white bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  Ver todas
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {posts.slice(0, 6).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Seção CTA - Call to Action (logo após Últimas Notícias) */}
        {cta && <CTASection cta={cta} />}

        {/* Seção de Vídeos */}
        {videos && videos.length > 0 && <VideoSection videos={videos} />}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
              Nossos Serviços
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
              A ABCIP oferece soluções completas em iluminação pública para
              cidades e municípios, garantindo eficiência energética e
              sustentabilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Iluminação Pública</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Gestão completa da iluminação pública com tecnologia de ponta e
                eficiência energética.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Eficiência Energética</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Soluções sustentáveis que reduzem o consumo de energia e os
                custos operacionais.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Manutenção e Suporte</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Equipe especializada disponível 24/7 para garantir o
                funcionamento contínuo.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

