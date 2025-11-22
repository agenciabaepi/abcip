"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { AboutPage } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";

interface AboutEditorProps {
  aboutPage?: AboutPage | null;
}

interface AboutForm {
  title: string;
  content: string;
}

export default function AboutEditor({ aboutPage }: AboutEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState<string | null>(
    aboutPage?.image_url || null
  );
  const [bannerImage, setBannerImage] = useState<string | null>(
    aboutPage?.banner_image || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AboutForm>({
    defaultValues: {
      title: aboutPage?.title || "Quem Somos",
      content: aboutPage?.content || "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'content' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'banner') {
      setIsUploadingBanner(true);
    } else {
      setIsUploading(true);
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      if (type === 'banner') {
        setBannerImage(publicUrl);
      } else {
        setImageUrl(publicUrl);
      }
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao enviar imagem.");
    } finally {
      if (type === 'banner') {
        setIsUploadingBanner(false);
      } else {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (data: AboutForm) => {
    setIsSaving(true);
    try {
      const aboutData = {
        title: data.title,
        content: data.content,
        image_url: imageUrl || null,
        banner_image: bannerImage || null,
        updated_at: new Date().toISOString(),
      };

      if (aboutPage) {
        const { error } = await supabase
          .from("about_page")
          .update(aboutData)
          .eq("id", aboutPage.id);

        if (error) throw error;
        toast.success("Página atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("about_page").insert(aboutData);

        if (error) throw error;
        toast.success("Página criada com sucesso!");
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving about page:", error);
      toast.error("Erro ao salvar página.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            {...register("title", { required: "Título é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner da Página
          </label>
          {bannerImage && (
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image src={bannerImage} alt="Banner" fill className="object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'banner')}
            disabled={isUploadingBanner}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          {isUploadingBanner && (
            <p className="text-sm text-gray-500 mt-1">Enviando banner...</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Imagem que aparece no topo da página "Quem Somos"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem de Conteúdo
          </label>
          {imageUrl && (
            <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
              <Image src={imageUrl} alt="Quem Somos" fill className="object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'content')}
            disabled={isUploading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          {isUploading && (
            <p className="text-sm text-gray-500 mt-1">Enviando imagem...</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Imagem que aparece no conteúdo da página
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conteúdo *
          </label>
          <textarea
            rows={15}
            {...register("content", { required: "Conteúdo é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            placeholder="Digite o conteúdo. Você pode usar HTML para formatação."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Dica: Use HTML para formatação (ex: &lt;p&gt;, &lt;strong&gt;, &lt;br&gt;)
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-500 text-dark-900 px-6 py-2 rounded-lg hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </form>
  );
}

