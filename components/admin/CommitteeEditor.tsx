"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { StrategicCommittee } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";

interface CommitteeEditorProps {
  committee?: StrategicCommittee | null;
}

interface CommitteeForm {
  name: string;
  leader_name: string;
  leader_email: string;
  description: string;
  order: number;
  active: boolean;
}

export default function CommitteeEditor({ committee }: CommitteeEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState<string | null>(
    committee?.image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommitteeForm>({
    defaultValues: {
      name: committee?.name || "",
      leader_name: committee?.leader_name || "",
      leader_email: committee?.leader_email || "",
      description: committee?.description || "",
      order: committee?.order || 0,
      active: committee?.active ?? true,
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

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 15MB.");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `committee-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `committees/${fileName}`;

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

      setImageUrl(publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CommitteeForm) => {
    setIsSaving(true);
    try {
      const committeeData = {
        name: data.name,
        leader_name: data.leader_name || null,
        leader_email: data.leader_email || null,
        description: data.description || null,
        image_url: imageUrl || null,
        order: data.order || 0,
        active: data.active,
        updated_at: new Date().toISOString(),
      };

      if (committee) {
        const { error } = await supabase
          .from("strategic_committees")
          .update(committeeData)
          .eq("id", committee.id);

        if (error) throw error;
        toast.success("Comitê estratégico atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("strategic_committees").insert(committeeData);

        if (error) throw error;
        toast.success("Comitê estratégico criado com sucesso!");
      }

      router.refresh();
      router.push("/admin/committees");
    } catch (error) {
      console.error("Error saving committee:", error);
      toast.error("Erro ao salvar comitê estratégico.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Comitê *
          </label>
          <input
            type="text"
            {...register("name", { required: "Nome é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: Comitê de Cidades Inteligentes"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Líder
            </label>
            <input
              type="text"
              {...register("leader_name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email do Líder
            </label>
            <input
              type="email"
              {...register("leader_email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="exemplo@abcip.com.br"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            rows={8}
            {...register("description")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            placeholder="Descrição completa do comitê. Você pode usar HTML para formatação (ex: &lt;p&gt;, &lt;strong&gt;, &lt;br&gt;)..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Dica: Use HTML para formatação. Ex: &lt;p&gt; para parágrafos, &lt;strong&gt; para negrito, &lt;br&gt; para quebra de linha
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem
          </label>
          {imageUrl && (
            <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden border border-gray-300 bg-dark-900 flex items-center justify-center">
              <Image src={imageUrl} alt="Imagem" fill className="object-contain p-4" />
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          {isUploading && (
            <p className="text-sm text-gray-500 mt-1">Enviando imagem...</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Formatos: JPG, PNG, WEBP. Máx: 15MB. A imagem aparecerá no topo do card com fundo escuro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordem de Exibição
            </label>
            <input
              type="number"
              {...register("order", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Números menores aparecem primeiro
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("active")}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Ativo</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Comitês inativos não aparecem no site
            </p>
          </div>
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

