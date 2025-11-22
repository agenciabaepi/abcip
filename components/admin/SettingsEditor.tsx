"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { SiteSettings } from "@/lib/types";
import toast from "react-hot-toast";

interface SettingsEditorProps {
  siteSettings?: SiteSettings | null;
}

interface SettingsForm {
  site_name: string;
  site_description: string;
  contact_email: string;
}

export default function SettingsEditor({ siteSettings }: SettingsEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(
    siteSettings?.logo_url || null
  );
  const [logoWhiteUrl, setLogoWhiteUrl] = useState<string | null>(
    siteSettings?.logo_white_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingWhite, setIsUploadingWhite] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    defaultValues: {
      site_name: siteSettings?.site_name || "ABCIP",
      site_description: siteSettings?.site_description || "",
      contact_email: siteSettings?.contact_email || "",
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG, WEBP ou SVG).");
      return;
    }

    // Validação de tamanho (máximo 2MB para logo)
    const maxSize = 2 * 1024 * 1024; // 2MB em bytes
    if (file.size > maxSize) {
      toast.error("O logo deve ter no máximo 2MB. Por favor, comprima a imagem e tente novamente.");
      return;
    }

    setIsUploading(true);
    try {
      // Remove logo antigo se existir
      if (logoUrl) {
        try {
          const oldPath = logoUrl.split("/").slice(-2).join("/");
          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (error) {
          console.warn("Erro ao remover logo antigo:", error);
        }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast.success("Logo enviado com sucesso!");
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(error.message || "Erro ao enviar logo. Tente novamente.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    toast.success("Logo removido. Selecione uma nova imagem.");
  };

  const handleLogoWhiteUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG, WEBP ou SVG).");
      return;
    }

    // Validação de tamanho (máximo 2MB para logo)
    const maxSize = 2 * 1024 * 1024; // 2MB em bytes
    if (file.size > maxSize) {
      toast.error("O logo deve ter no máximo 2MB. Por favor, comprima a imagem e tente novamente.");
      return;
    }

    setIsUploadingWhite(true);
    try {
      // Remove logo branco antigo se existir
      if (logoWhiteUrl) {
        try {
          const oldPath = logoWhiteUrl.split("/").slice(-2).join("/");
          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (error) {
          console.warn("Erro ao remover logo branco antigo:", error);
        }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `logo-white-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setLogoWhiteUrl(publicUrl);
      toast.success("Logo branco enviado com sucesso!");
    } catch (error: any) {
      console.error("Error uploading white logo:", error);
      toast.error(error.message || "Erro ao enviar logo branco. Tente novamente.");
    } finally {
      setIsUploadingWhite(false);
      e.target.value = "";
    }
  };

  const handleRemoveLogoWhite = () => {
    setLogoWhiteUrl(null);
    toast.success("Logo branco removido. Selecione uma nova imagem.");
  };

  const onSubmit = async (data: SettingsForm) => {
    setIsSaving(true);
    try {
      const settingsData = {
        site_name: data.site_name,
        site_description: data.site_description || null,
        contact_email: data.contact_email || null,
        logo_url: logoUrl || null,
        logo_white_url: logoWhiteUrl || null,
        updated_at: new Date().toISOString(),
      };

      if (siteSettings) {
        const { error } = await supabase
          .from("site_settings")
          .update(settingsData)
          .eq("id", siteSettings.id);

        if (error) throw error;
        toast.success("Configurações atualizadas com sucesso!");
      } else {
        const { error } = await supabase.from("site_settings").insert(settingsData);

        if (error) throw error;
        toast.success("Configurações criadas com sucesso!");
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo da Empresa
          </label>
          {logoUrl && (
            <div className="relative w-full max-w-xs h-32 mb-4 rounded-lg overflow-hidden border border-gray-300 bg-gray-50 flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  console.error("Error loading logo:", logoUrl);
                  e.currentTarget.style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
              >
                Remover
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mb-2"></div>
                  <p className="text-sm text-gray-700 font-medium">Enviando logo...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: JPG, PNG, WEBP, SVG. Tamanho máximo: 2MB. Recomendado: fundo transparente (PNG/SVG)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Branco (para fundos escuros)
          </label>
          {logoWhiteUrl && (
            <div className="relative w-full max-w-xs h-32 mb-4 rounded-lg overflow-hidden border border-gray-300 bg-gray-900 flex items-center justify-center">
              <img 
                src={logoWhiteUrl} 
                alt="Logo Branco" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  console.error("Error loading white logo:", logoWhiteUrl);
                  e.currentTarget.style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={handleRemoveLogoWhite}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
              >
                Remover
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoWhiteUpload}
              disabled={isUploadingWhite}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isUploadingWhite && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mb-2"></div>
                  <p className="text-sm text-gray-700 font-medium">Enviando logo branco...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Logo branco para usar em fundos escuros. Formatos aceitos: JPG, PNG, WEBP, SVG. Tamanho máximo: 2MB.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Site *
          </label>
          <input
            type="text"
            {...register("site_name", { required: "Nome do site é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.site_name && (
            <p className="text-red-500 text-sm mt-1">{errors.site_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Site
          </label>
          <textarea
            rows={3}
            {...register("site_description")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Breve descrição do site..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email de Contato
          </label>
          <input
            type="email"
            {...register("contact_email")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="contato@abcip.com.br"
          />
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

