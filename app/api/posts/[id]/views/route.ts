import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Resolve params se for Promise (Next.js 15) ou usa diretamente (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const postId = resolvedParams.id;
    
    // Obtém o número atual de views
    const { data: post } = await supabase
      .from("posts")
      .select("views")
      .eq("id", postId)
      .single();

    const currentViews = post?.views || 0;

    // Incrementa o contador de visualizações
    const { error } = await supabase
      .from("posts")
      .update({ views: currentViews + 1 })
      .eq("id", postId);

    if (error) throw error;

    return NextResponse.json({ success: true, views: currentViews + 1 });
  } catch (error: any) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao incrementar visualizações" },
      { status: 500 }
    );
  }
}

