import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/lib/types";
import Link from "next/link";

interface SearchParams {
  q?: string;
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const query = searchParams.q || "";

  let posts: Post[] = [];

  if (query.trim()) {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .or(
        `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    posts = (data as Post[]) || [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight">
            Resultados da Busca
            {query && (
              <span className="block sm:inline text-base sm:text-lg font-normal text-gray-600 mt-1 sm:mt-0 sm:ml-2">
                para &quot;{query}&quot;
              </span>
            )}
          </h1>

          {query.trim() ? (
            posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Nenhum resultado encontrado para &quot;{query}&quot;.
                </p>
                <Link
                  href="/noticias"
                  className="text-primary-500 hover:text-primary-600 font-medium"
                >
                  Ver todas as notícias →
                </Link>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Digite um termo de busca.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

