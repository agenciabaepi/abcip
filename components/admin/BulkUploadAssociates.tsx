"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function BulkUploadAssociates() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const supabase = createClient();

  const MAX_FILES = 50;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Você pode enviar no máximo ${MAX_FILES} imagens por vez.`);
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    // Criar previews
    const previewPromises = selectedFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const newPreviews = await Promise.all(previewPromises);
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleBulkUpload = async () => {
    if (files.length === 0) {
      toast.error("Selecione pelo menos uma imagem.");
      return;
    }

    setIsUploading(true);
    const progress: { [key: string]: number } = {};

    try {
      // Buscar a maior ordem atual para definir a ordem dos novos associados
      const { data: existingAssociates } = await supabase
        .from("associates")
        .select("order")
        .order("order", { ascending: false })
        .limit(1);
      
      let currentOrder = existingAssociates && existingAssociates.length > 0 
        ? (existingAssociates[0].order || 0) 
        : 0;

      const uploadPromises = files.map(async (file, index) => {
        try {
          // Extrair nome da empresa do nome do arquivo (remover extensão)
          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const name = fileNameWithoutExt;

          const fileExt = file.name.split(".").pop();
          const uniqueFileName = `associate-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `associates/${uniqueFileName}`;

          // Upload do arquivo
          const { error: uploadError } = await supabase.storage
            .from("uploads")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("uploads").getPublicUrl(filePath);

          // Criar registro no banco
          const { error: insertError } = await supabase.from("associates").insert({
            name: name,
            logo_url: publicUrl,
            website: null,
            order: currentOrder + index + 1,
          });

          if (insertError) throw insertError;

          progress[file.name] = 100;
          setUploadProgress({ ...progress });

          return { success: true, name };
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          progress[file.name] = -1; // -1 indica erro
          setUploadProgress({ ...progress });
          return { success: false, name: file.name, error: error.message };
        }
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter((r) => r.success).length;
      const errorCount = results.filter((r) => !r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} associado(s) criado(s) com sucesso!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} associado(s) falharam ao ser criados.`);
      }

      // Limpar após sucesso
      if (errorCount === 0) {
        setFiles([]);
        setPreviews([]);
        setUploadProgress({});
        // Recarregar a página após um pequeno delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error in bulk upload:", error);
      toast.error("Erro ao fazer upload em lote.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Upload Múltiplo de Associados
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Selecione até {MAX_FILES} imagens de logos. O nome do arquivo será usado como nome da empresa.
      </p>

      <div className="mb-4">
        <label className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition w-fit">
          <Upload className="w-5 h-5" />
          <span>Selecionar Imagens ({files.length}/{MAX_FILES})</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={isUploading || files.length >= MAX_FILES}
            className="hidden"
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {previews[index] && (
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isUploading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate" title={file.name}>
                  {file.name.replace(/\.[^/.]+$/, "")}
                </p>
                {uploadProgress[file.name] !== undefined && (
                  <div className="mt-1">
                    {uploadProgress[file.name] === -1 ? (
                      <span className="text-xs text-red-500">Erro</span>
                    ) : uploadProgress[file.name] === 100 ? (
                      <span className="text-xs text-green-500">✓ Concluído</span>
                    ) : (
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={handleBulkUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Enviar {files.length} Associado(s)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

