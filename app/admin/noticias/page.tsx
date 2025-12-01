"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

interface NoticiasPageSettings {
  id: string;
  banner_image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function AdminNoticiasPage() {
  const [settings, setSettings] = useState<NoticiasPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("noticias_page_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Se não existir, cria um registro vazio
        const { data: newData, error: insertError } = await supabase
          .from("noticias_page_settings")
          .insert({ banner_image_url: null })
          .select()
          .single();

        if (insertError) throw insertError;
        if (newData) setSettings(newData);
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function uploadBannerImage(file: File) {
    setUploadingBanner(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-noticias-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      // Se settings existe, atualiza, senão insere
      let updateError;
      if (settings?.id) {
        const { error } = await supabase
          .from("noticias_page_settings")
          .update({ 
            banner_image_url: publicUrl, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", settings.id);
        updateError = error;
      } else {
        const { error } = await supabase
          .from("noticias_page_settings")
          .insert({ banner_image_url: publicUrl });
        updateError = error;
      }

      if (updateError) throw updateError;

      // Recarrega os dados
      await loadData();
      toast.success("Banner atualizado!");
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      toast.error(`Erro: ${error.message || "Erro ao fazer upload do banner"}`);
    } finally {
      setUploadingBanner(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Configurações da Página de Notícias</h1>

        {/* Banner Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Banner da Página</h2>
          
          {settings?.banner_image_url && (
            <div className="mb-4">
              <img
                src={settings.banner_image_url}
                alt="Banner atual"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition w-fit">
            <Upload className="w-4 h-4" />
            {uploadingBanner ? "Enviando..." : "Upload Banner"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadBannerImage(file);
              }}
              disabled={uploadingBanner}
            />
          </label>

          <p className="text-sm text-gray-500 mt-2">
            O banner será exibido no topo das páginas de notícias (listagem e individual).
          </p>
        </div>
      </div>
    </div>
  );
}

