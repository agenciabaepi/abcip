"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteAllAssociatesButtonProps {
  count: number;
}

export default function DeleteAllAssociatesButton({
  count,
}: DeleteAllAssociatesButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDeleteAll = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/associates/delete-all", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao excluir associados");
      }

      toast.success(`${count} associado(s) excluído(s) com sucesso!`);
      router.refresh();
      setShowConfirm(false);
    } catch (error: any) {
      console.error("Error deleting all associates:", error);
      toast.error(error.message || "Erro ao excluir associados.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (count === 0) {
    return null;
  }

  return (
    <div className="relative">
      {!showConfirm ? (
        <button
          onClick={handleDeleteAll}
          disabled={isDeleting}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          <Trash2 className="w-5 h-5" />
          <span>Excluir Todos ({count})</span>
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="flex items-center space-x-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isDeleting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span>Confirmar Exclusão</span>
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

