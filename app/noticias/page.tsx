import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

interface SearchParams {
  page?: string;
}

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let posts: Post[] = [];
  let totalPages = 1;
  let settings: any = null;

  try {
    const supabase = await createClient();
    const page = parseInt(searchParams.page || "1");
    const postsPerPage = 12;
    const from = (page - 1) * postsPerPage;
    const to = from + postsPerPage - 1;

    const [postsRes, settingsRes] = await Promise.all([
      supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(from, to),
      supabase.from("noticias_page_settings").select("*").single(),
    ]);

    const postsData = (postsRes.data as Post[]) || [];
    
    // Buscar contagem de comentários para todos os posts de uma vez
    if (postsData.length > 0) {
      const postIds = postsData.map((p) => p.id);
      const { data: commentsData } = await supabase
        .from("post_comments")
        .select("post_id")
        .in("post_id", postIds)
        .eq("approved", true);

      // Contar comentários por post_id
      const commentsCountMap = new Map<string, number>();
      if (commentsData) {
        commentsData.forEach((comment) => {
          const currentCount = commentsCountMap.get(comment.post_id) || 0;
          commentsCountMap.set(comment.post_id, currentCount + 1);
        });
      }

      // Adicionar contagem de comentários aos posts
      posts = postsData.map((post) => ({
        ...post,
        comments_count: commentsCountMap.get(post.id) || 0,
      }));
    } else {
      posts = [];
    }
    totalPages = Math.ceil((postsRes.count || 0) / postsPerPage);
    settings = settingsRes.data;
  } catch (error) {
    console.warn("Não foi possível carregar notícias:", error);
  }

  const page = parseInt(searchParams.page || "1");

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-gray-50">
        {/* Banner da Página */}
        {settings?.banner_image_url && (
          <div className="relative h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[35vh] min-h-[150px] sm:min-h-[200px] w-full overflow-hidden">
            <Image
              src={settings.banner_image_url}
              alt="Banner Notícias"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight">
            Notícias
          </h1>

          {posts && posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2">
                  {page > 1 && (
                    <Link
                      href={`/noticias?page=${page - 1}`}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Anterior
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/noticias?page=${pageNum}`}
                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition ${
                          pageNum === page
                            ? "bg-primary-500 text-dark-900 font-semibold"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  )}

                  {page < totalPages && (
                    <Link
                      href={`/noticias?page=${page + 1}`}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Próxima
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhuma notícia encontrada.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

