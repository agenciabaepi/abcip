import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Obtém o número atual de likes
    const { data: post } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", params.id)
      .single();

    const currentLikes = post?.likes || 0;

    // Incrementa o contador de likes
    const { error } = await supabase
      .from("posts")
      .update({ likes: currentLikes + 1 })
      .eq("id", params.id);

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

