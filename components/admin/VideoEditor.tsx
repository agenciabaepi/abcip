"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Video } from "@/lib/types";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import toast from "react-hot-toast";

interface VideoEditorProps {
  video?: Video | null;
}

interface VideoForm {
  title: string;
  description: string;
  youtube_url: string;
  order_index: number;
  active: boolean;
}

export default function VideoEditor({ video }: VideoEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VideoForm>({
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
      youtube_url: video?.youtube_url || "",
      order_index: video?.order_index ?? 0,
      active: video?.active ?? true,
    },
  });

  const youtubeUrl = watch("youtube_url");
  const active = watch("active");

  // Atualiza preview da thumbnail quando a URL muda
  useEffect(() => {
    if (youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        const thumbnail = getYouTubeThumbnail(youtubeUrl);
        setThumbnailPreview(thumbnail);
      } else {
        setThumbnailPreview(null);
      }
    } else {
      setThumbnailPreview(null);
    }
  }, [youtubeUrl]);

  const onSubmit = async (data: VideoForm) => {
    setIsSaving(true);
    try {
      // Valida se a URL do YouTube é válida
      const videoId = extractYouTubeId(data.youtube_url);
      if (!videoId) {
        toast.error("URL do YouTube inválida. Use um link válido do YouTube.");
        setIsSaving(false);
        return;
      }

      const thumbnailUrl = getYouTubeThumbnail(data.youtube_url);

      const videoData = {
        title: data.title,
        description: data.description || null,
        youtube_url: data.youtube_url,
        thumbnail_url: thumbnailUrl,
        order_index: data.order_index,
        active: data.active,
        updated_at: new Date().toISOString(),
      };

      if (video) {
        const { error } = await supabase
          .from("videos")
          .update(videoData)
          .eq("id", video.id);

        if (error) throw error;
        toast.success("Vídeo atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("videos").insert(videoData);

        if (error) throw error;
        toast.success("Vídeo criado com sucesso!");
      }

      router.refresh();
      router.push("/admin/videos");
    } catch (error: any) {
      console.error("Error saving video:", error);
      toast.error(error.message || "Erro ao salvar vídeo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Preview da Thumbnail */}
        {thumbnailPreview && (
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview da Thumbnail</h3>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* Status Ativo/Inativo */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("active")}
              className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Vídeo Ativo (exibir na homepage)
            </span>
          </label>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título do Vídeo *
          </label>
          <input
            type="text"
            {...register("title", { required: "Título é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: Apresentação ABCIP 2024"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            rows={3}
            {...register("description")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Breve descrição do vídeo..."
          />
        </div>

        {/* URL do YouTube */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL do YouTube *
          </label>
          <input
            type="url"
            {...register("youtube_url", {
              required: "URL do YouTube é obrigatória",
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/,
                message: "URL inválida. Use um link do YouTube.",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
          />
          {errors.youtube_url && (
            <p className="text-red-500 text-sm mt-1">{errors.youtube_url.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: youtube.com/watch?v=... ou youtu.be/...
          </p>
        </div>

        {/* Ordem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordem de Exibição
          </label>
          <input
            type="number"
            {...register("order_index", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="0"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Vídeos com menor número aparecem primeiro
          </p>
        </div>

        {/* Botão Salvar */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-500 text-dark-900 px-6 py-2 rounded-lg hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSaving ? "Salvando..." : video ? "Atualizar Vídeo" : "Criar Vídeo"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/videos")}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}

