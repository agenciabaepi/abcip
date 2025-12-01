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
    
    // Obtém o número atual de likes
    const { data: post } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", postId)
      .single();

    const currentLikes = post?.likes || 0;

    // Incrementa o contador de likes
    const { error } = await supabase
      .from("posts")
      .update({ likes: currentLikes + 1 })
      .eq("id", postId);

    if (error) throw error;

    return NextResponse.json({ success: true, likes: currentLikes + 1 });
  } catch (error: any) {
    console.error("Error incrementing likes:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao curtir notícia" },
      { status: 500 }
    );
  }
}

