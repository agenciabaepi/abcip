import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Incrementa o contador de visualizações
    const { error } = await supabase.rpc('increment_post_views', {
      post_id: params.id
    });

    // Se a função RPC não existir, usa UPDATE direto
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      const { data: post } = await supabase
        .from("posts")
        .select("views")
        .eq("id", params.id)
        .single();

      const currentViews = post?.views || 0;

      const { error: updateError } = await supabase
        .from("posts")
        .update({ views: currentViews + 1 })
        .eq("id", params.id);

      if (updateError) throw updateError;
    } else if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao incrementar visualizações" },
      { status: 500 }
    );
  }
}

