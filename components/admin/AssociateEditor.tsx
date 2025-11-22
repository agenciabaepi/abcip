"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Associate } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";

interface AssociateEditorProps {
  associate?: Associate;
}

interface AssociateForm {
  name: string;
  website: string;
}

export default function AssociateEditor({ associate }: AssociateEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [logoUrl, setLogoUrl] = useState<string | null>(
    associate?.logo_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssociateForm>({
    defaultValues: {
      name: associate?.name || "",
      website: associate?.website || "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `associates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast.success("Logo enviado com sucesso!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao enviar logo.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: AssociateForm) => {
    if (!logoUrl) {
      toast.error("Por favor, envie um logo.");
      return;
    }

    setIsSaving(true);
    try {
      const associateData = {
        name: data.name,
        logo_url: logoUrl,
        website: data.website || null,
        updated_at: new Date().toISOString(),
      };

      if (associate) {
        const { error } = await supabase
          .from("associates")
          .update(associateData)
          .eq("id", associate.id);

        if (error) throw error;
        toast.success("Associado atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("associates").insert(associateData);

        if (error) throw error;
        toast.success("Associado criado com sucesso!");
      }

      router.push("/admin/associates");
      router.refresh();
    } catch (error) {
      console.error("Error saving associate:", error);
      toast.error("Erro ao salvar associado.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo *
          </label>
          {logoUrl && (
            <div className="relative w-64 h-32 mb-4 rounded-lg overflow-hidden border border-gray-300">
              <Image src={logoUrl} alt="Logo" fill className="object-contain" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          {isUploading && (
            <p className="text-sm text-gray-500 mt-1">Enviando logo...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Empresa *
          </label>
          <input
            type="text"
            {...register("name", { required: "Nome é obrigatório" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            {...register("website")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://exemplo.com (opcional)"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving || !logoUrl}
            className="bg-primary-500 text-dark-900 px-6 py-2 rounded-lg hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSaving ? "Salvando..." : associate ? "Atualizar" : "Criar"}
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

