"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Save } from "lucide-react";
import toast from "react-hot-toast";

interface AssociadosPageSettings {
  id: string;
  banner_image_url: string | null;
  cta_title?: string | null;
  cta_description?: string | null;
  cta_button_text?: string | null;
  cta_button_link?: string | null;
  cta_image_url?: string | null;
  cta_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function AdminAssociadosPage() {
  const [settings, setSettings] = useState<AssociadosPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingCTAImage, setUploadingCTAImage] = useState(false);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("Faça Parte");
  const [ctaButtonLink, setCtaButtonLink] = useState("");
  const [ctaImageUrl, setCtaImageUrl] = useState<string | null>(null);
  const [ctaActive, setCtaActive] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("associados_page_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSettings(data);
        setCtaTitle(data.cta_title || "");
        setCtaDescription(data.cta_description || "");
        setCtaButtonText(data.cta_button_text || "Faça Parte");
        setCtaButtonLink(data.cta_button_link || "");
        setCtaImageUrl(data.cta_image_url || null);
        setCtaActive(data.cta_active || false);
      } else {
        // Se não existir, cria um registro vazio
        const { data: newData, error: insertError } = await supabase
          .from("associados_page_settings")
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
      const fileName = `banner-associados-${Date.now()}.${fileExt}`;
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
          .from("associados_page_settings")
          .update({ 
            banner_image_url: publicUrl, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", settings.id);
        updateError = error;
      } else {
        const { error } = await supabase
          .from("associados_page_settings")
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

  async function uploadCTAImage(file: File) {
    setUploadingCTAImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `cta-associados-${Date.now()}.${fileExt}`;
      const filePath = `cta/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      setCtaImageUrl(publicUrl);
      toast.success("Imagem do CTA enviada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
      toast.error(`Erro: ${error.message || "Erro ao fazer upload da imagem"}`);
    } finally {
      setUploadingCTAImage(false);
    }
  }

  async function saveCTA() {
    if (!settings?.id) {
      toast.error("Erro: Configurações não encontradas");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("associados_page_settings")
        .update({
          cta_title: ctaTitle || null,
          cta_description: ctaDescription || null,
          cta_button_text: ctaButtonText || "Faça Parte",
          cta_button_link: ctaButtonLink || null,
          cta_image_url: ctaImageUrl || null,
          cta_active: ctaActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("CTA salvo com sucesso!");
      await loadData();
    } catch (error: any) {
      console.error("Erro ao salvar CTA:", error);
      toast.error(`Erro: ${error.message || "Erro ao salvar CTA"}`);
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
        <h1 className="text-3xl font-bold mb-8">Configurações da Página de Associados</h1>

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
            O banner será exibido no topo da página de associados.
          </p>
        </div>

        {/* CTA Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">CTA (Call to Action)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do CTA
              </label>
              <input
                type="text"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                placeholder="Ex: Seja associado ABCIP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do CTA
              </label>
              <textarea
                value={ctaDescription}
                onChange={(e) => setCtaDescription(e.target.value)}
                placeholder="Ex: Juntos, vamos conectar empresas e iluminar o futuro."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  placeholder="Ex: Faça Parte"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Botão
                </label>
                <input
                  type="text"
                  value={ctaButtonLink}
                  onChange={(e) => setCtaButtonLink(e.target.value)}
                  placeholder="Ex: /contato"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem do CTA
              </label>
              {ctaImageUrl && (
                <div className="mb-4">
                  <img
                    src={ctaImageUrl}
                    alt="CTA atual"
                    className="w-full max-w-md h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition w-fit">
                <Upload className="w-4 h-4" />
                {uploadingCTAImage ? "Enviando..." : "Upload Imagem CTA"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCTAImage(file);
                  }}
                  disabled={uploadingCTAImage}
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cta_active"
                checked={ctaActive}
                onChange={(e) => setCtaActive(e.target.checked)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="cta_active" className="text-sm font-medium text-gray-700">
                CTA Ativo
              </label>
            </div>

            <button
              onClick={saveCTA}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              <Save className="w-5 h-5" />
              <span>Salvar CTA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

