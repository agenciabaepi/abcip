"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteBannerButtonProps {
  bannerId: string;
}

export default function DeleteBannerButton({ bannerId }: DeleteBannerButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("banners").delete().eq("id", bannerId);

      if (error) throw error;

      toast.success("Banner excluído com sucesso!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Erro ao excluir banner.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition disabled:opacity-50 text-sm flex items-center space-x-1"
    >
      <Trash2 className="w-4 h-4" />
      <span>Excluir</span>
    </button>
  );
}

