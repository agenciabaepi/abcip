"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteAssociateButtonProps {
  associateId: string;
}

export default function DeleteAssociateButton({
  associateId,
}: DeleteAssociateButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este associado?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("associates")
        .delete()
        .eq("id", associateId);

      if (error) throw error;

      toast.success("Associado excluído com sucesso!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting associate:", error);
      toast.error("Erro ao excluir associado.");
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

