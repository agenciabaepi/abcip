import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import TeamMemberCard from "@/components/TeamMemberCard";
import BoardMemberProfile from "@/components/BoardMemberProfile";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function QuemSomosPage() {
  const supabase = await createClient();
  
  const [aboutPageResult, teamResult, boardResult] = await Promise.all([
    supabase.from("about_page").select("*").single(),
    supabase.from("team_members").select("*").order("order", { ascending: true }),
    supabase.from("board_members").select("*").order("order", { ascending: true }),
  ]);

  const aboutPage = aboutPageResult.data;
  const teamMembers = teamResult.data || [];
  const boardMembers = boardResult.data || [];

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
        {/* Banner da Página */}
        {aboutPage?.banner_image && (
          <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] min-h-[300px] w-full overflow-hidden">
            <Image
              src={aboutPage.banner_image}
              alt={aboutPage.title || "Quem Somos"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
                  {aboutPage.title || "Quem Somos"}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        {aboutPage?.content && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: aboutPage.content,
              }}
            />
          </section>
        )}

        {/* Diretoria */}
        {boardMembers.length > 0 && (
          <section className="bg-white py-8 md:py-10 lg:py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                  Diretoria
                </h2>
              </div>
              <div className="space-y-0">
                {boardMembers.map((member, index) => (
                  <BoardMemberProfile key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Equipe */}
        {teamMembers.length > 0 && (
          <section className="py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
                  Nossa Equipe
                </h2>
                <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                  Profissionais dedicados ao sucesso da ABCIP
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {teamMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
