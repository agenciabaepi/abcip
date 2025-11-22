"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Banner } from "@/lib/types";
import toast from "react-hot-toast";
// Removido import Image - vamos usar img normal para evitar problemas com otimização

interface BannerEditorProps {
  banner?: Banner;
}

interface BannerForm {
  title: string;
  subtitle: string;
  link: string;
  order: number;
}

export default function BannerEditor({ banner }: BannerEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState<string | null>(
    banner?.image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BannerForm>({
    defaultValues: {
      title: banner?.title || "",
      subtitle: banner?.subtitle || "",
      link: banner?.link || "",
      order: banner?.order || 0,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG, WEBP ou GIF).");
      return;
    }

    // Validação de tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 5MB. Por favor, comprima a imagem e tente novamente.");
      return;
    }

    setIsUploading(true);
    try {
      // Remove imagem antiga se estiver editando
      if (banner?.image_url && imageUrl) {
        try {
          const oldPath = imageUrl.split("/").slice(-2).join("/"); // Extrai o caminho do bucket
          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (error) {
          console.warn("Erro ao remover imagem antiga:", error);
          // Não bloqueia o upload se falhar ao remover a imagem antiga
        }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        // Tratamento de erros mais específico
        if (uploadError.message.includes("already exists")) {
          throw new Error("Uma imagem com este nome já existe. Tente novamente.");
        } else if (uploadError.message.includes("not found")) {
          throw new Error("Bucket de armazenamento não encontrado. Verifique a configuração do Supabase.");
        } else {
          throw uploadError;
        }
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    toast.success("Imagem removida. Selecione uma nova imagem.");
  };

  const onSubmit = async (data: BannerForm) => {
    if (!imageUrl) {
      toast.error("Por favor, envie uma imagem.");
      return;
    }

    setIsSaving(true);
    try {
      // Verifica se o usuário está autenticado e obtém a sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        console.error("No session found. User needs to login.");
        toast.error("Você precisa estar autenticado para salvar banners. Faça login novamente.");
        setIsSaving(false);
        router.push("/admin/login");
        return;
      }

      console.log("User authenticated:", session.user.email);
      console.log("Session token exists:", !!session.access_token);
      console.log("User ID:", session.user.id);
      
      // Força a atualização da sessão antes de fazer o INSERT
      // Isso garante que o token esteja atualizado
      await supabase.auth.refreshSession();

      const bannerData = {
        image_url: imageUrl,
        title: data.title || null,
        subtitle: data.subtitle || null,
        link: data.link || null,
        order: data.order || 0,
      };

      if (banner) {
        // Usa API route do servidor para garantir que a sessão seja passada corretamente
        const response = await fetch("/api/banners", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: banner.id,
            ...bannerData,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Erro ao atualizar banner");
        }

        toast.success("Banner atualizado com sucesso!");
      } else {
        console.log("Inserting banner via API:", bannerData);
        
        // Usa API route do servidor para garantir que a sessão seja passada corretamente
        const response = await fetch("/api/banners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bannerData),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Insert error:", result);
          throw new Error(result.error || "Erro ao criar banner");
        }

        console.log("Banner inserted successfully:", result.data);
        toast.success("Banner criado com sucesso!");
      }

      router.push("/admin/banners");
      router.refresh();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Erro ao salvar banner.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem *
          </label>
          {imageUrl && (
            <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden border border-gray-300">
              <img 
                src={imageUrl} 
                alt="Banner" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading image:", imageUrl);
                  // Não tenta carregar placeholder, apenas mostra mensagem
                  e.currentTarget.style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
              >
                Remover
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mb-2"></div>
                  <p className="text-sm text-gray-700 font-medium">Enviando imagem...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: JPG, PNG, WEBP, GIF. Tamanho máximo: 5MB
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Título do banner (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtítulo
          </label>
          <input
            type="text"
            {...register("subtitle")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Subtítulo do banner (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link
          </label>
          <input
            type="url"
            {...register("link")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://exemplo.com (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordem
          </label>
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="0"
          />
          <p className="text-sm text-gray-500 mt-1">
            Banners com menor número aparecem primeiro
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving || !imageUrl}
            className="bg-primary-500 text-dark-900 px-6 py-2 rounded-lg hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSaving ? "Salvando..." : banner ? "Atualizar" : "Criar"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}

