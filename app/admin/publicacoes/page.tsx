"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Publicacao, PublicacoesPageSettings } from "@/lib/types";
import { Upload, Plus, Pencil, Trash2, Save, X, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPublicacoesPage() {
  const [settings, setSettings] = useState<PublicacoesPageSettings | null>(null);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Publicacao>>({
    title: "",
    description: "",
    order: 0,
    active: true,
  });
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const supabase = createClient();
      const [settingsRes, publicacoesRes] = await Promise.all([
        supabase.from("publicacoes_page_settings").select("*").single(),
        supabase.from("publicacoes").select("*").order("order", { ascending: true }),
      ]);

      if (settingsRes.data) setSettings(settingsRes.data);
      if (publicacoesRes.data) setPublicacoes(publicacoesRes.data);
    } catch (error) {
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
      const fileName = `banner-publicacoes-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("site-images")
        .getPublicUrl(filePath);

      // Se settings existe, atualiza, senão insere
      let updateError;
      if (settings?.id) {
        const { error } = await supabase
          .from("publicacoes_page_settings")
          .update({ banner_image_url: publicUrl, updated_at: new Date().toISOString() })
          .eq("id", settings.id);
        updateError = error;
      } else {
        const { error } = await supabase
          .from("publicacoes_page_settings")
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

  async function uploadPublicacaoImage(file: File) {
    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `publicacao-${Date.now()}.${fileExt}`;
      const filePath = `publicacoes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Imagem carregada!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setUploadingImage(false);
    }
  }

  async function uploadPublicacaoFile(file: File) {
    setUploadingFile(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `arquivo-${Date.now()}.${fileExt}`;
      const filePath = `publicacoes-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, file_url: publicUrl, file_name: file.name }));
      toast.success("Arquivo carregado!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload do arquivo");
    } finally {
      setUploadingFile(false);
    }
  }

  async function savePublicacao() {
    if (!formData.title) {
      toast.error("Título é obrigatório");
      return;
    }

    try {
      const supabase = createClient();
      
      // Prepara os dados removendo campos undefined
      const dataToSave = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url || null,
        file_url: formData.file_url || null,
        file_name: formData.file_name || null,
        order: formData.order || 0,
        active: formData.active !== undefined ? formData.active : true,
      };
      
      if (editingId) {
        const { error } = await supabase
          .from("publicacoes")
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Publicação atualizada!");
      } else {
        const { error } = await supabase
          .from("publicacoes")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Publicação criada!");
      }

      setEditingId(null);
      setFormData({ title: "", description: "", order: 0, active: true });
      await loadData();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(`Erro: ${error.message || "Erro ao salvar publicação"}`);
    }
  }

  async function deletePublicacao(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("publicacoes").delete().eq("id", id);

      if (error) throw error;
      toast.success("Publicação excluída!");
      await loadData();
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      toast.error(`Erro: ${error.message || "Erro ao excluir publicação"}`);
    }
  }

  function editPublicacao(pub: Publicacao) {
    setEditingId(pub.id);
    setFormData(pub);
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({ title: "", description: "", order: 0, active: true });
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gerenciar Publicações</h1>

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
              onChange={(e) => e.target.files?.[0] && uploadBannerImage(e.target.files[0])}
              disabled={uploadingBanner}
            />
          </label>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Publicação" : "Nova Publicação"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título*</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Título da publicação"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                placeholder="Descrição da publicação"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ordem</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.active ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagem da Publicação</label>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-48 h-32 object-cover rounded mb-2" />
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition w-fit">
                <Upload className="w-4 h-4" />
                {uploadingImage ? "Enviando..." : "Upload Imagem"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadPublicacaoImage(e.target.files[0])}
                  disabled={uploadingImage}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Arquivo para Download (PDF, etc)</label>
              {formData.file_name && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <FileText className="w-4 h-4" />
                  {formData.file_name}
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition w-fit">
                <Upload className="w-4 h-4" />
                {uploadingFile ? "Enviando..." : "Upload Arquivo"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadPublicacaoFile(e.target.files[0])}
                  disabled={uploadingFile}
                />
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={savePublicacao}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Atualizar" : "Criar"}
              </button>

              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Publicações Cadastradas</h2>

          <div className="space-y-4">
            {publicacoes.map((pub) => (
              <div key={pub.id} className="border rounded-lg p-4 flex items-start gap-4">
                {pub.image_url && (
                  <img src={pub.image_url} alt={pub.title} className="w-32 h-24 object-cover rounded" />
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{pub.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{pub.description}</p>
                  {pub.file_name && (
                    <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                      <FileText className="w-3 h-3" />
                      {pub.file_name}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Ordem: {pub.order}</span>
                    <span className={pub.active ? "text-green-600" : "text-red-600"}>
                      {pub.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editPublicacao(pub)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePublicacao(pub.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {publicacoes.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhuma publicação cadastrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

