"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { CTASection } from "@/lib/types";
import toast from "react-hot-toast";

interface CTAEditorProps {
  cta?: CTASection | null;
}

interface CTAForm {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  active: boolean;
  use_dual_cta: boolean;
  cta1_button_color: string;
  cta2_title: string;
  cta2_description: string;
  cta2_button_text: string;
  cta2_button_link: string;
  cta2_button_color: string;
}

export default function CTAEditor({ cta }: CTAEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    cta?.image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl2, setImageUrl2] = useState<string | null>(
    cta?.cta2_image_url || null
  );
  const [isUploading2, setIsUploading2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CTAForm>({
    defaultValues: {
      title: cta?.title || "Publicações ABCIP",
      description: cta?.description || "Conheça nossas publicações e saiba mais sobre o mercado.",
      button_text: cta?.button_text || "Conheça",
      button_link: cta?.button_link || "/publicacoes",
      active: cta?.active ?? false,
      use_dual_cta: cta?.use_dual_cta ?? false,
      cta1_button_color: cta?.cta1_button_color || cta?.cta2_button_color || "#3b82f6",
      cta2_title: cta?.cta2_title || "Faça Parte",
      cta2_description: cta?.cta2_description || "Seja associado ABCIP. Juntos, vamos conectar empresas e iluminar o futuro.",
      cta2_button_text: cta?.cta2_button_text || "Associe-se",
      cta2_button_link: cta?.cta2_button_link || "/contato",
      cta2_button_color: cta?.cta2_button_color || "#3b82f6",
    },
  });

  const active = watch("active");
  const useDualCTA = watch("use_dual_cta");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG ou WEBP).");
      return;
    }

    // Validação de tamanho (máximo 15MB)
    const maxSize = 15 * 1024 * 1024; // 15MB em bytes
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 15MB. Por favor, comprima a imagem e tente novamente.");
      return;
    }

    setIsUploading(true);
    try {
      // Remove imagem antiga se existir
      if (imageUrl) {
        try {
          const oldPath = imageUrl.split("/").slice(-2).join("/");
          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (error) {
          console.warn("Erro ao remover imagem antiga:", error);
        }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `cta-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cta/${fileName}`;

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

      setImageUrl(publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    toast.success("Imagem removida. Selecione uma nova imagem.");
  };

  const handleImageUpload2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG ou WEBP).");
      return;
    }

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 15MB. Por favor, comprima a imagem e tente novamente.");
      return;
    }

    setIsUploading2(true);
    try {
      if (imageUrl2) {
        try {
          const oldPath = imageUrl2.split("/").slice(-2).join("/");
          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (error) {
          console.warn("Erro ao remover imagem antiga:", error);
        }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `cta2-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cta/${fileName}`;

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

      setImageUrl2(publicUrl);
      toast.success("Imagem do segundo CTA enviada com sucesso!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploading2(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage2 = () => {
    setImageUrl2(null);
    toast.success("Imagem removida. Selecione uma nova imagem.");
  };

  const onSubmit = async (data: CTAForm) => {
    setIsSaving(true);
    try {
      const ctaData = {
        title: data.title,
        description: data.description,
        button_text: data.button_text,
        button_link: data.button_link || null,
        image_url: imageUrl || null,
        active: data.active,
        use_dual_cta: data.use_dual_cta,
        cta1_button_color: data.use_dual_cta ? data.cta1_button_color : null,
        cta2_title: data.use_dual_cta ? data.cta2_title : null,
        cta2_description: data.use_dual_cta ? data.cta2_description : null,
        cta2_button_text: data.use_dual_cta ? data.cta2_button_text : null,
        cta2_button_link: data.use_dual_cta ? (data.cta2_button_link || null) : null,
        cta2_image_url: data.use_dual_cta ? (imageUrl2 || null) : null,
        cta2_button_color: data.use_dual_cta ? data.cta2_button_color : null,
        updated_at: new Date().toISOString(),
      };

      if (cta) {
        const { error } = await supabase
          .from("cta_section")
          .update(ctaData)
          .eq("id", cta.id);

        if (error) throw error;
        toast.success("CTA atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("cta_section").insert(ctaData);

        if (error) throw error;
        toast.success("CTA criada com sucesso!");
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error saving CTA:", error);
      toast.error(error.message || "Erro ao salvar CTA.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Preview da CTA */}
        {active && (
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview da CTA</h3>
            <div className="bg-gradient-to-br from-[#031C30] via-[#052a45] to-[#031C30] rounded-lg p-6 text-white">
              <h4 className="text-2xl font-bold mb-3">{watch("title") || "Título"}</h4>
              <p className="text-gray-200 mb-4">{watch("description") || "Descrição"}</p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#5FE074] text-[#031C30] font-bold rounded-lg">
                {watch("button_text") || "Botão"}
              </div>
            </div>
          </div>
        )}

        {/* Status Ativo/Inativo */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("active")}
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                CTA Ativa (exibir na homepage)
              </span>
            </label>
          </div>

          {/* Usar Dual CTA */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("use_dual_cta")}
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Usar 2 CTAs lado a lado
              </span>
            </label>
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            {...register("title", { required: "Título é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Faça Parte"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            rows={4}
            {...register("description", { required: "Descrição é obrigatória" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Seja associado ABCIP. Juntos, vamos conectar empresas e iluminar o futuro."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Texto do Botão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texto do Botão *
          </label>
          <input
            type="text"
            {...register("button_text", { required: "Texto do botão é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Associe-se"
          />
          {errors.button_text && (
            <p className="text-red-500 text-sm mt-1">{errors.button_text.message}</p>
          )}
        </div>

        {/* Link do Botão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link do Botão
          </label>
          <input
            type="text"
            {...register("button_link")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="/contato ou https://..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Pode ser um link interno (ex: /contato) ou externo (ex: https://...)
          </p>
        </div>

        {/* Upload de Imagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem da CTA
          </label>
          {imageUrl && (
            <div className="relative w-full max-w-md aspect-[4/5] mb-4 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
              <img
                src={imageUrl}
                alt="CTA Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading CTA image:", imageUrl);
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
            Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 15MB. Recomendado: proporção 4:5 (vertical)
          </p>
        </div>

        {/* Seção do Segundo CTA */}
        {useDualCTA && (
          <div className="border-t border-gray-300 pt-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segundo CTA (Lado Direito)</h3>

            {/* Título CTA 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Segundo CTA *
              </label>
              <input
                type="text"
                {...register("cta2_title", { required: useDualCTA ? "Título é obrigatório" : false })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Faça Parte"
              />
              {errors.cta2_title && (
                <p className="text-red-500 text-sm mt-1">{errors.cta2_title.message}</p>
              )}
            </div>

            {/* Descrição CTA 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Segundo CTA *
              </label>
              <textarea
                rows={4}
                {...register("cta2_description", { required: useDualCTA ? "Descrição é obrigatória" : false })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Seja associado ABCIP. Juntos, vamos conectar empresas e iluminar o futuro."
              />
              {errors.cta2_description && (
                <p className="text-red-500 text-sm mt-1">{errors.cta2_description.message}</p>
              )}
            </div>

            {/* Texto do Botão CTA 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto do Botão do Segundo CTA *
              </label>
              <input
                type="text"
                {...register("cta2_button_text", { required: useDualCTA ? "Texto do botão é obrigatório" : false })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Associe-se"
              />
              {errors.cta2_button_text && (
                <p className="text-red-500 text-sm mt-1">{errors.cta2_button_text.message}</p>
              )}
            </div>

            {/* Link do Botão CTA 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link do Botão do Segundo CTA
              </label>
              <input
                type="text"
                {...register("cta2_button_link")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="/contato ou https://..."
              />
            </div>

            {/* Cor do Botão CTA 1 (lado esquerdo) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor do Botão do Primeiro CTA - Lado Esquerdo (em hex, ex: #3b82f6)
              </label>
              <input
                type="text"
                {...register("cta1_button_color")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="#3b82f6"
              />
              <p className="text-xs text-gray-500 mt-1">
                Esta cor será usada no botão do primeiro CTA (lado esquerdo)
              </p>
            </div>

            {/* Upload de Imagem CTA 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do Segundo CTA
              </label>
              {imageUrl2 && (
                <div className="relative w-full max-w-md aspect-[4/3] mb-4 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
                  <img
                    src={imageUrl2}
                    alt="CTA 2 Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Error loading CTA 2 image:", imageUrl2);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage2}
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
                  onChange={handleImageUpload2}
                  disabled={isUploading2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isUploading2 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mb-2"></div>
                      <p className="text-sm text-gray-700 font-medium">Enviando imagem...</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 15MB.
              </p>
            </div>
          </div>
        )}

        {/* Botão Salvar */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary-500 text-dark-900 px-6 py-2 rounded-lg hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSaving ? "Salvando..." : "Salvar CTA"}
          </button>
        </div>
      </div>
    </form>
  );
}

