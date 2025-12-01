import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import PostStats from "@/components/PostStats";
import PostCard from "@/components/PostCard";
import CommentsSection from "@/components/CommentsSection";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Clock, User } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils";
import { Post } from "@/lib/types";

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const [postRes, settingsRes, recentPostsRes] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("id", params.id)
      .eq("published", true)
      .single(),
    supabase.from("noticias_page_settings").select("*").single(),
    supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .neq("id", params.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const post = postRes.data;
  const settings = settingsRes.data;
  const recentPostsData = (recentPostsRes.data as Post[]) || [];

  // Buscar contagem de comentários para os posts recentes
  let recentPosts: Post[] = [];
  if (recentPostsData.length > 0) {
    const postIds = recentPostsData.map((p) => p.id);
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
    recentPosts = recentPostsData.map((post) => ({
      ...post,
      comments_count: commentsCountMap.get(post.id) || 0,
    }));
  }

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const publishDate = post.publish_date || post.created_at;
  const publishDateTime = new Date(publishDate);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <main className="flex-grow bg-white">
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

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <Link
            href="/noticias"
            className="text-sm sm:text-base text-primary-500 hover:text-primary-600 mb-4 sm:mb-6 inline-block transition-colors"
          >
            ← Voltar para notícias
          </Link>

          {post.cover_image && (
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full mb-6 sm:mb-8 rounded-xl overflow-hidden">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight leading-tight">
              {post.title}
            </h1>
            
            {/* Metadados: Data, Horário, Autor, Tempo de Leitura */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
              <time dateTime={publishDate} className="flex items-center gap-1">
                <span>
                  {format(publishDateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
                <span className="text-gray-400">•</span>
                <span>
                  {format(publishDateTime, "HH:mm", { locale: ptBR })}h
                </span>
              </time>
              
              {post.author && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </div>
                </>
              )}
              
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTime} min de leitura</span>
              </div>
              
              {post.external_link && (
                <>
                  <span className="text-gray-400">•</span>
                  <a
                    href={post.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Fonte externa</span>
                  </a>
                </>
              )}
            </div>
            
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-gray-700 italic mb-4">
                {post.excerpt}
              </p>
            )}
          </header>

          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <PostStats
            postId={post.id}
            initialViews={post.views || 0}
            initialLikes={post.likes || 0}
            initialShares={post.shares || 0}
            shareUrl={`/noticias/${post.id}`}
            shareTitle={post.title}
            shareDescription={post.excerpt || ""}
          />
        </article>

        {/* Posts Recentes e Comentários */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Posts Recentes */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Posts recentes
              </h2>
              <Link
                href="/noticias"
                className="text-sm sm:text-base text-primary-500 hover:text-primary-600 transition-colors"
              >
                Ver tudo
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recentPosts.map((recentPost) => (
                  <PostCard key={recentPost.id} post={recentPost} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Nenhum post recente encontrado.</p>
            )}
          </div>

          {/* Comentários */}
          <CommentsSection postId={post.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

