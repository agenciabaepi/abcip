import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import BannerSlider from "@/components/BannerSlider";
import PostCard from "@/components/PostCard";
import CTASection from "@/components/CTASection";
import NewsCategories from "@/components/NewsCategories";
import ABCIPText from "@/components/ABCIPText";
import { createClient } from "@/lib/supabase/server";
import { Banner, Post, CTASection as CTASectionType } from "@/lib/types";
import Link from "next/link";

export default async function Home() {
  let banners: Banner[] = [];
  let posts: Post[] = [];
  let cta: CTASectionType | null = null;

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

    banners = (bannersData as Banner[]) || [];
    posts = (postsData as Post[]) || [];
    cta = (ctaData && ctaData.length > 0 ? (ctaData[0] as CTASectionType) : null);
    
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

        {/* Seção de Categorias de Notícias */}
        <NewsCategories />

        {/* Seção CTA - Call to Action */}
        {cta && <CTASection cta={cta} />}

      </main>
      <Footer />
    </div>
  );
}

