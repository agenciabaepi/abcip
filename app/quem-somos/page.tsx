import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import TeamMemberCard from "@/components/TeamMemberCard";
import BoardMemberProfile from "@/components/BoardMemberProfile";
import StrategicCommitteeCard from "@/components/StrategicCommitteeCard";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function QuemSomosPage() {
  let aboutPage: any = null;
  let teamMembers: any[] = [];
  let boardMembers: any[] = [];
  let committees: any[] = [];

  try {
    const supabase = await createClient();
    
    const [aboutPageResult, teamResult, boardResult, committeesResult] = await Promise.all([
      supabase.from("about_page").select("*").single(),
      supabase.from("team_members").select("*").order("order", { ascending: true }),
      supabase.from("board_members").select("*").order("order", { ascending: true }),
      supabase.from("strategic_committees").select("*").eq("active", true).order("order", { ascending: true }),
    ]);

    aboutPage = aboutPageResult.data;
    teamMembers = teamResult.data || [];
    boardMembers = boardResult.data || [];
    committees = committeesResult.data || [];
  } catch (error) {
    console.warn("Não foi possível carregar dados do Supabase:", error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
        {/* Banner da Página */}
        {aboutPage?.banner_image && (
          <div className="relative h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[35vh] min-h-[150px] sm:min-h-[200px] w-full overflow-hidden">
            <Image
              src={aboutPage.banner_image}
              alt={aboutPage.title || "Quem Somos"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Conteúdo Principal */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 text-left tracking-tight mb-3 sm:mb-4 md:mb-6">
            {aboutPage?.title || "Quem Somos"}
          </h1>
          {aboutPage?.content && (
            <div
              className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none font-archivo font-thin text-sm sm:text-base md:text-lg lg:text-xl"
              dangerouslySetInnerHTML={{
                __html: aboutPage.content,
              }}
            />
          )}
        </section>

        {/* Diretoria */}
        {boardMembers.length > 0 && (
          <section className="bg-white py-6 sm:py-8 md:py-10 lg:py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                  Diretoria
                </h2>
              </div>
              <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
                {boardMembers.map((member, index) => (
                  <BoardMemberProfile key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Comitês Estratégicos */}
        {committees.length > 0 && (
          <section className="bg-white py-6 sm:py-8 md:py-10 lg:py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
                  Comitês Estratégicos
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {committees.map((committee) => (
                  <StrategicCommitteeCard key={committee.id} committee={committee} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Equipe */}
        {teamMembers.length > 0 && (
          <section className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-12 tracking-tight">
                  Equipe
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 justify-items-center">
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
