"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { TeamMember, BoardMember } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";

interface MemberEditorProps {
  member?: TeamMember | BoardMember | null;
  type: "team" | "board";
}

interface MemberForm {
  name: string;
  position: string;
  bio: string;
  email: string;
  linkedin: string;
  order: number;
}

export default function MemberEditor({ member, type }: MemberEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    member?.photo_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberForm>({
    defaultValues: {
      name: member?.name || "",
      position: member?.position || "",
      bio: member?.bio || "",
      email: member?.email || "",
      linkedin: member?.linkedin || "",
      order: member?.order || 0,
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG ou WEBP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${type}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${type}/${fileName}`;

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

      setPhotoUrl(publicUrl);
      toast.success("Foto enviada com sucesso!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Erro ao enviar foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: MemberForm) => {
    setIsSaving(true);
    try {
      const memberData = {
        name: data.name,
        position: data.position,
        bio: data.bio || null,
        photo_url: photoUrl || null,
        email: data.email || null,
        linkedin: data.linkedin || null,
        order: data.order || 0,
        updated_at: new Date().toISOString(),
      };

      const tableName = type === "team" ? "team_members" : "board_members";

      if (member) {
        const { error } = await supabase
          .from(tableName)
          .update(memberData)
          .eq("id", member.id);

        if (error) throw error;
        toast.success(`${type === "team" ? "Membro da equipe" : "Membro da diretoria"} atualizado com sucesso!`);
      } else {
        const { error } = await supabase.from(tableName).insert(memberData);

        if (error) throw error;
        toast.success(`${type === "team" ? "Membro da equipe" : "Membro da diretoria"} criado com sucesso!`);
      }

      router.refresh();
      router.push(`/admin/${type === "team" ? "team" : "board"}`);
    } catch (error) {
      console.error(`Error saving ${type} member:`, error);
      toast.error(`Erro ao salvar ${type === "team" ? "membro da equipe" : "membro da diretoria"}.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            {...register("name", { required: "Nome é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Nome completo"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo/Posição *
          </label>
          <input
            type="text"
            {...register("position", { required: "Cargo é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: Diretor Executivo, Gerente de Projetos"
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biografia
          </label>
          <textarea
            rows={8}
            {...register("bio")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            placeholder="Biografia completa do membro. Você pode usar HTML para formatação (ex: &lt;p&gt;, &lt;strong&gt;, &lt;br&gt;)..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Dica: Use HTML para formatação. Ex: &lt;p&gt; para parágrafos, &lt;strong&gt; para negrito, &lt;br&gt; para quebra de linha
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto
          </label>
          {photoUrl && (
            <div className="relative w-32 h-32 mb-4 rounded-lg overflow-hidden border border-gray-300">
              <Image src={photoUrl} alt="Foto" fill className="object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handlePhotoUpload}
            disabled={isUploading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          {isUploading && (
            <p className="text-sm text-gray-500 mt-1">Enviando foto...</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Formatos: JPG, PNG, WEBP. Máx: 5MB
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="email@exemplo.com"
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
              placeholder="https://linkedin.com/in/usuario"
            />
          </div>
        </div>

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

