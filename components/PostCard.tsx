import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Post } from "@/lib/types";
import { Clock, User } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const publishDate = post.publish_date || post.created_at;

  return (
    <Link href={`/noticias/${post.id}`}>
      <article className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col hover:-translate-y-1">
        {post.cover_image && (
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          {/* Metadados */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
            <time dateTime={publishDate} className="flex items-center gap-1">
              {format(new Date(publishDate), "dd 'de' MMM", {
                locale: ptBR,
              })}
            </time>
            {post.author && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="line-clamp-1">{post.author}</span>
                </div>
              </>
            )}
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min</span>
            </div>
          </div>

          {/* Botão de ação */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 group-hover:text-primary-600 transition-colors">
              Ler mais
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

