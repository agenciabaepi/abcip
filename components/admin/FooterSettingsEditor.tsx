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
}

export default function FooterSettingsEditor({
  footerSettings,
}: FooterSettingsEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);

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
    },
  });

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
        links: JSON.stringify(parsedLinks),
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

