import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Post } from "@/lib/types";
import { Clock, User, Eye, MessageCircle, Bookmark } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils";
import PostCardLikeButton from "./PostCardLikeButton";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const publishDate = post.publish_date || post.created_at;
  const views = post.views || 0;
  const likes = post.likes || 0;
  const commentsCount = post.comments_count || 0;

  return (
    <Link href={`/noticias/${post.id}`}>
      <article className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Imagem sem overlays */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-200">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col">
          {/* Header com logo ABCIP, data e tempo de leitura, bookmark */}
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">ABCIP</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <time dateTime={publishDate}>
                {format(new Date(publishDate), "dd 'de' MMM", {
                  locale: ptBR,
                })}
              </time>
              <span>•</span>
              <span>{readingTime} min de leitura</span>
            </div>
            <Bookmark className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>

          {/* Título */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-5 text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 line-clamp-3 flex-1 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Métricas de engajamento */}
          <div className="mt-auto pt-4 flex items-center justify-between text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{views}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span>{commentsCount}</span>
              </div>
            </div>
            <PostCardLikeButton postId={post.id} initialLikes={likes} />
          </div>
        </div>
      </article>
    </Link>
  );
}

