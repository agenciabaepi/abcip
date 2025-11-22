"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteVideoButtonProps {
  videoId: string;
  videoTitle: string;
}

export default function DeleteVideoButton({ videoId, videoTitle }: DeleteVideoButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o vídeo "${videoTitle}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("videos").delete().eq("id", videoId);

      if (error) throw error;

      toast.success("Vídeo excluído com sucesso!");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting video:", error);
      toast.error(error.message || "Erro ao excluir vídeo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? "Excluindo..." : "Excluir"}
    </button>
  );
}

