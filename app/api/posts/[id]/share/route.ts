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
    
    // Obtém o número atual de shares
    const { data: post } = await supabase
      .from("posts")
      .select("shares")
      .eq("id", postId)
      .single();

    const currentShares = post?.shares || 0;

    // Incrementa o contador de compartilhamentos
    const { error } = await supabase
      .from("posts")
      .update({ shares: currentShares + 1 })
      .eq("id", postId);

    if (error) throw error;

    return NextResponse.json({ success: true, shares: currentShares + 1 });
  } catch (error: any) {
    console.error("Error incrementing shares:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao contar compartilhamento" },
      { status: 500 }
    );
  }
}

