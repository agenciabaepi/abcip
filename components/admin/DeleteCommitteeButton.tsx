"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteCommitteeButtonProps {
  committeeId: string;
}

export default function DeleteCommitteeButton({
  committeeId,
}: DeleteCommitteeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este comitê estratégico?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("strategic_committees")
        .delete()
        .eq("id", committeeId);

      if (error) throw error;

      toast.success("Comitê estratégico excluído com sucesso!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting committee:", error);
      toast.error("Erro ao excluir comitê estratégico.");
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

