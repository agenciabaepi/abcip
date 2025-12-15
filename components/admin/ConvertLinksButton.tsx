"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ConvertLinksButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    total?: number;
    updated?: number;
    unchanged?: number;
    errors?: Array<{ id: string; error: string }>;
  } | null>(null);

  const handleConvert = async () => {
    if (
      !confirm(
        "Esta ação irá processar todas as publicações e converter URLs em links clicáveis. Deseja continuar?"
      )
    ) {
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch("/api/posts/convert-links", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar publicações");
      }

      setResult(data);
      
      if (data.updated > 0) {
        toast.success(
          `${data.updated} publicação(ões) atualizada(s) com sucesso!`
        );
      } else {
        toast.success("Nenhuma publicação precisou ser atualizada.");
      }

      if (data.errors && data.errors.length > 0) {
        toast.error(
          `${data.errors.length} erro(s) durante o processamento.`
        );
      }
    } catch (error: any) {
      console.error("Error converting links:", error);
      toast.error(error.message || "Erro ao processar publicações");
      setResult({ success: false });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Converter URLs em Links
          </h3>
          <p className="text-xs text-gray-600">
            Processa todas as publicações e converte URLs em links clicáveis automaticamente.
          </p>
        </div>
        <button
          onClick={handleConvert}
          disabled={isProcessing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processando...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Converter Links</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          {result.success ? (
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Processamento concluído!
                </p>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p>Total de publicações: {result.total}</p>
                  <p className="text-green-600">
                    Atualizadas: {result.updated}
                  </p>
                  {result.unchanged !== undefined && (
                    <p className="text-gray-500">
                      Sem alterações: {result.unchanged}
                    </p>
                  )}
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-600 font-medium">
                        Erros ({result.errors.length}):
                      </p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {result.errors.map((err, idx) => (
                          <li key={idx} className="text-red-600">
                            ID {err.id}: {err.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">
                Erro ao processar publicações.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

