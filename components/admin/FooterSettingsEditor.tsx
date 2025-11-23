"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { FooterSettings } from "@/lib/types";
import toast from "react-hot-toast";

interface FooterSettingsEditorProps {
  footerSettings?: FooterSettings | null;
}

interface FooterForm {
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
}

export default function FooterSettingsEditor({
  footerSettings,
}: FooterSettingsEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    footerSettings?.background_image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const parsedLinks = footerSettings?.links
    ? JSON.parse(footerSettings.links)
    : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FooterForm>({
    defaultValues: {
      address: footerSettings?.address || "",
      phone: footerSettings?.phone || "",
      email: footerSettings?.email || "",
      facebook: footerSettings?.facebook || "",
      instagram: footerSettings?.instagram || "",
      linkedin: footerSettings?.linkedin || "",
      twitter: footerSettings?.twitter || "",
      youtube: footerSettings?.youtube || "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG ou WEBP).");
      return;
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 15MB. Por favor, comprima a imagem e tente novamente.");
      return;
    }

    setIsUploading(true);
    try {
      if (backgroundImageUrl) {
        try {
          const oldPath = backgroundImageUrl.split("/").slice(-2).join("/");
          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (error) {
          console.warn("Erro ao remover imagem antiga:", error);
        }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `footer-bg-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `footer/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setBackgroundImageUrl(publicUrl);
      toast.success("Imagem de fundo enviada com sucesso!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setBackgroundImageUrl(null);
    toast.success("Imagem removida. Selecione uma nova imagem.");
  };

  const onSubmit = async (data: FooterForm) => {
    setIsSaving(true);
    try {
      const footerData = {
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        youtube: data.youtube || null,
        links: JSON.stringify(parsedLinks),
        background_image_url: backgroundImageUrl || null,
        updated_at: new Date().toISOString(),
      };

      if (footerSettings) {
        const { error } = await supabase
          .from("footer_settings")
          .update(footerData)
          .eq("id", footerSettings.id);

        if (error) throw error;
        toast.success("Configurações do rodapé atualizadas com sucesso!");
      } else {
        const { error } = await supabase.from("footer_settings").insert(footerData);

        if (error) throw error;
        toast.success("Configurações do rodapé criadas com sucesso!");
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving footer settings:", error);
      toast.error("Erro ao salvar configurações do rodapé.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço
          </label>
          <textarea
            rows={2}
            {...register("address")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Rua, número, bairro, cidade - CEP"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="(00) 0000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="contato@abcip.com.br"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              {...register("facebook")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://facebook.com/abcip"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              {...register("instagram")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://instagram.com/abcip"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              {...register("linkedin")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://linkedin.com/company/abcip"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="url"
              {...register("twitter")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://twitter.com/abcip"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube
            </label>
            <input
              type="url"
              {...register("youtube")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://youtube.com/@abcip"
            />
          </div>
        </div>

        {/* Upload de Imagem de Fundo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem de Fundo do Rodapé
          </label>
          {backgroundImageUrl && (
            <div className="relative w-full max-w-md aspect-video mb-4 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
              <img
                src={backgroundImageUrl}
                alt="Footer Background Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading footer background image:", backgroundImageUrl);
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
              accept="image/jpeg,image/jpg,image/png,image/webp"
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
            Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 15MB. A imagem será aplicada como fundo do rodapé.
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

