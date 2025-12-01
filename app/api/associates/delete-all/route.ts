import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE() {
  try {
    const supabase = await createClient();

    // Verificar autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Buscar todos os associados para obter as URLs das imagens
    const { data: associates, error: fetchError } = await supabase
      .from("associates")
      .select("logo_url");

    if (fetchError) {
      console.error("Error fetching associates:", fetchError);
      return NextResponse.json(
        { message: "Erro ao buscar associados" },
        { status: 500 }
      );
    }

    // Deletar todas as imagens do storage
    if (associates && associates.length > 0) {
      const deletePromises = associates
        .filter((associate) => associate.logo_url)
        .map(async (associate) => {
          try {
            // Extrair o caminho do arquivo da URL
            const url = associate.logo_url;
            const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
            
            if (match && match[1]) {
              const filePath = match[1];
              const { error: deleteError } = await supabase.storage
                .from("uploads")
                .remove([filePath]);

              if (deleteError) {
                console.error(`Error deleting file ${filePath}:`, deleteError);
                // Não falhar se não conseguir deletar a imagem
              }
            }
          } catch (error) {
            console.error("Error processing file deletion:", error);
            // Continuar mesmo se houver erro ao deletar uma imagem
          }
        });

      await Promise.all(deletePromises);
    }

    // Deletar todos os registros do banco
    // Usar uma query que sempre retorna true para deletar todos
    const { error: deleteError } = await supabase
      .from("associates")
      .delete()
      .gte("created_at", "1970-01-01"); // Condição que sempre é verdadeira (todos têm created_at)

    if (deleteError) {
      console.error("Error deleting associates:", deleteError);
      return NextResponse.json(
        { message: "Erro ao excluir associados" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Todos os associados foram excluídos com sucesso",
      count: associates?.length || 0,
    });
  } catch (error: any) {
    console.error("Error in delete-all route:", error);
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

