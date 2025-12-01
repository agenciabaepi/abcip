"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PostComment } from "@/lib/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", postId)
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments((data as PostComment[]) || []);
    } catch (error: any) {
      console.error("Erro ao carregar comentários:", error);
      toast.error("Erro ao carregar comentários");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!authorName.trim() || !content.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (authorName.trim().length < 2) {
      toast.error("O nome deve ter pelo menos 2 caracteres");
      return;
    }

    if (content.trim().length < 3) {
      toast.error("O comentário deve ter pelo menos 3 caracteres");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author_name: authorName.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar comentário");
      }

      toast.success("Comentário enviado com sucesso!");
      setAuthorName("");
      setContent("");
      await loadComments();
    } catch (error: any) {
      console.error("Erro ao enviar comentário:", error);
      toast.error(error.message || "Erro ao enviar comentário");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Comentários {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Formulário de comentário */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="mb-4">
            <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-2">
              Seu nome
            </label>
            <input
              type="text"
              id="author_name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              required
              disabled={submitting}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Comentário
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva um comentário"
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar comentário</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Lista de comentários */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">Carregando comentários...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {comment.author_name}
                  </h4>
                  {comment.created_at && (
                    <time className="text-xs sm:text-sm text-gray-500">
                      {format(new Date(comment.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </time>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

