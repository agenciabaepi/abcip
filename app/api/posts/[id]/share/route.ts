import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Obtém o número atual de shares
    const { data: post } = await supabase
      .from("posts")
      .select("shares")
      .eq("id", params.id)
      .single();

    const currentShares = post?.shares || 0;

    // Incrementa o contador de compartilhamentos
    const { error } = await supabase
      .from("posts")
      .update({ shares: currentShares + 1 })
      .eq("id", params.id);

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

