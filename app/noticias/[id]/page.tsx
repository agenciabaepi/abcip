import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import PostStats from "@/components/PostStats";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Clock, User } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils";

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .eq("published", true)
    .single();

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
      </main>
      <Footer />
    </div>
  );
}

