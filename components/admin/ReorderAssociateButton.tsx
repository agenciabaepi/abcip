"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ReorderAssociateButtonProps {
  associateId: string;
  currentOrder: number;
  isFirst: boolean;
  isLast: boolean;
  onReorder: () => void;
}

export default function ReorderAssociateButton({
  associateId,
  currentOrder,
  isFirst,
  isLast,
  onReorder,
}: ReorderAssociateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReorder = async (direction: "up" | "down") => {
    if (isLoading) return;
    if (direction === "up" && isFirst) return;
    if (direction === "down" && isLast) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/associates/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          associateId,
          direction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reordenar associado");
      }

      toast.success("Ordem atualizada com sucesso!");
      onReorder();
    } catch (error: any) {
      console.error("Erro ao reordenar:", error);
      toast.error(error.message || "Erro ao reordenar associado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => handleReorder("up")}
        disabled={isFirst || isLoading}
        className={`p-1.5 rounded transition-colors ${
          isFirst || isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        aria-label="Mover para cima"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleReorder("down")}
        disabled={isLast || isLoading}
        className={`p-1.5 rounded transition-colors ${
          isLast || isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        aria-label="Mover para baixo"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}

