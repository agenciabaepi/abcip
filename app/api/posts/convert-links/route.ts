import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { convertUrlsToLinks } from "@/lib/utils";

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    // Buscar todas as publicações
    const { data: posts, error: fetchError } = await supabase
      .from("posts")
      .select("id, content");
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhuma publicação encontrada",
        updated: 0,
      });
    }
    
    let updatedCount = 0;
    const errors: Array<{ id: string; error: string }> = [];
    
    // Processar cada publicação
    for (const post of posts) {
      if (!post.content) continue;
      
      // Converter URLs em links
      const convertedContent = convertUrlsToLinks(post.content);
      
      // Só atualizar se o conteúdo mudou
      if (convertedContent !== post.content) {
        const { error: updateError } = await supabase
          .from("posts")
          .update({ content: convertedContent })
          .eq("id", post.id);
        
        if (updateError) {
          errors.push({ id: post.id, error: updateError.message });
        } else {
          updatedCount++;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processamento concluído`,
      total: posts.length,
      updated: updatedCount,
      unchanged: posts.length - updatedCount - errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error converting links:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar publicações" },
      { status: 500 }
    );
  }
}

