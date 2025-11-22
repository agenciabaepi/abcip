import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import DeleteVideoButton from "@/components/admin/DeleteVideoButton";
import VideoThumbnail from "@/components/admin/VideoThumbnail";

export default async function VideosPage() {
  await requireAuth();

  const supabase = await createClient();
  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching videos:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vídeos</h1>
          <p className="text-gray-600 mt-1">Gerencie os vídeos exibidos na homepage</p>
        </div>
        <Link
          href="/admin/videos/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-dark-900 rounded-lg hover:bg-primary-400 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Novo Vídeo
        </Link>
      </div>

      {!videos || videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 mb-4">Nenhum vídeo cadastrado ainda.</p>
          <Link
            href="/admin/videos/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-dark-900 rounded-lg hover:bg-primary-400 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Criar Primeiro Vídeo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              {video.thumbnail_url && (
                <div className="relative aspect-video bg-gray-900">
                  <VideoThumbnail
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {!video.active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <EyeOff className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              )}

              {/* Informações */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {video.title}
                  </h3>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                      video.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {video.active ? <Eye className="w-3 h-3 inline" /> : <EyeOff className="w-3 h-3 inline" />}
                  </span>
                </div>
                {video.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {video.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-4">
                  Ordem: {video.order_index}
                </p>

                {/* Ações */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/videos/${video.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Link>
                  <DeleteVideoButton videoId={video.id} videoTitle={video.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

