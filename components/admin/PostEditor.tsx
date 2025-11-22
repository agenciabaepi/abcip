"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/lib/types";
import toast from "react-hot-toast";
import { Calendar, Link as LinkIcon, Image as ImageIcon, Eye, User } from "lucide-react";

interface PostEditorProps {
  post?: Post;
}

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  external_link: string;
  publish_date: string;
  author: string;
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [coverImage, setCoverImage] = useState<string | null>(
    post?.cover_image || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostForm>({
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      published: post?.published || false,
      external_link: post?.external_link || "",
      publish_date: post?.publish_date 
        ? new Date(post.publish_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      author: post?.author || "",
    },
  });

  const published = watch("published");
  const title = watch("title");
  const excerpt = watch("excerpt");
  const content = watch("content");
  const publishDate = watch("publish_date");
  const externalLink = watch("external_link");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecione uma imagem válida (JPG, PNG, WEBP ou GIF).");
      return;
    }

    // Validação de tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 5MB. Por favor, comprima a imagem e tente novamente.");
      return;
    }

    setIsUploading(true);
    try {
      // Remove imagem antiga se estiver editando
      if (post?.cover_image && coverImage) {
        try {
          const oldPath = coverImage.split("/").slice(-2).join("/");
          await supabase.storage.from("uploads").remove([oldPath]);
        } catch (error) {
          console.warn("Erro ao remover imagem antiga:", error);
        }
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `post-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

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

      setCoverImage(publicUrl);
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
    setCoverImage(null);
    toast.success("Imagem removida. Selecione uma nova imagem.");
  };

  const onSubmit = async (data: PostForm) => {
    setIsSaving(true);
    try {
      const postData = {
        title: data.title,
        excerpt: data.excerpt || null,
        content: data.content,
        cover_image: coverImage || null,
        published: data.published,
        external_link: data.external_link || null,
        publish_date: data.publish_date ? new Date(data.publish_date).toISOString() : null,
        author: data.author || null,
        updated_at: new Date().toISOString(),
      };

      if (post) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", post.id);

        if (error) throw error;
        toast.success("Notícia atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("posts").insert(postData);

        if (error) throw error;
        toast.success("Notícia criada com sucesso!");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Erro ao salvar notícia.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {post ? "Editar Notícia" : "Nova Notícia"}
        </h2>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <Eye className="w-4 h-4" />
          <span>{showPreview ? "Editar" : "Preview"}</span>
        </button>
      </div>

      {showPreview ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {coverImage && (
              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                <img
                  src={coverImage}
                  alt={title || "Preview"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {title || "Título da Notícia"}
            </h1>
            {publishDate && (
              <p className="text-sm text-gray-500 mb-4">
                {new Date(publishDate).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
            {excerpt && (
              <p className="text-lg text-gray-700 mb-6 italic">{excerpt}</p>
            )}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content || "<p>Conteúdo da notícia...</p>" }}
            />
            {externalLink && (
              <div className="mt-6">
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Link externo</span>
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Notícia *
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Título é obrigatório" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Digite o título da notícia..."
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resumo / Descrição
                </label>
                <textarea
                  rows={3}
                  {...register("excerpt")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Breve resumo da notícia (aparece na listagem)..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este texto aparecerá na listagem de notícias. Se deixar em branco, será gerado automaticamente.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo da Notícia *
                </label>
                <textarea
                  rows={20}
                  {...register("content", { required: "Conteúdo é obrigatório" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  placeholder="Digite o conteúdo da notícia. Você pode usar HTML para formatação..."
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800 font-medium mb-1">💡 Dicas de formatação HTML:</p>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li><code>&lt;p&gt;</code> para parágrafos</li>
                    <li><code>&lt;strong&gt;</code> ou <code>&lt;b&gt;</code> para negrito</li>
                    <li><code>&lt;em&gt;</code> ou <code>&lt;i&gt;</code> para itálico</li>
                    <li><code>&lt;br&gt;</code> para quebra de linha</li>
                    <li><code>&lt;ul&gt;</code> e <code>&lt;li&gt;</code> para listas</li>
                    <li><code>&lt;a href="url"&gt;</code> para links</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Publicação</h3>
                
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("published")}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Publicar imediatamente</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Se desmarcado, a notícia ficará como rascunho
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data de Publicação
                  </label>
                  <input
                    type="date"
                    {...register("publish_date")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Data que aparecerá na notícia
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Autor
                  </label>
                  <input
                    type="text"
                    {...register("author")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nome do autor..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nome de quem escreveu a notícia
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Imagem de Capa</h3>
                
                {coverImage && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={coverImage}
                      alt="Capa"
                      className="w-full h-full object-cover"
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
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mb-2"></div>
                        <p className="text-sm text-gray-700 font-medium">Enviando...</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, WEBP, GIF. Máx: 5MB
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  Link Externo
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Externa (opcional)
                  </label>
                  <input
                    type="url"
                    {...register("external_link")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://exemplo.com/noticia"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link para notícia externa ou fonte adicional
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary-500 text-dark-900 px-6 py-2 rounded-lg hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSaving ? "Salvando..." : post ? "Atualizar Notícia" : "Criar Notícia"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
