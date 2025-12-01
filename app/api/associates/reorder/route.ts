import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { associateId, direction } = body;

    if (!associateId || !direction) {
      return NextResponse.json(
        { error: "associateId e direction são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar o associado atual
    const { data: currentAssociate, error: fetchError } = await supabase
      .from("associates")
      .select("order")
      .eq("id", associateId)
      .single();

    if (fetchError || !currentAssociate) {
      return NextResponse.json(
        { error: "Associado não encontrado" },
        { status: 404 }
      );
    }

    const currentOrder = currentAssociate.order || 0;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    // Buscar o associado que está na posição de destino
    const { data: targetAssociate } = await supabase
      .from("associates")
      .select("id, order")
      .eq("order", newOrder)
      .single();

    // Se existe um associado na posição de destino, trocar as ordens
    if (targetAssociate) {
      // Atualizar o associado de destino para a ordem atual
      const { error: updateTargetError } = await supabase
        .from("associates")
        .update({ order: currentOrder, updated_at: new Date().toISOString() })
        .eq("id", targetAssociate.id);

      if (updateTargetError) {
        return NextResponse.json(
          { error: "Erro ao atualizar ordem do associado" },
          { status: 500 }
        );
      }
    }

    // Atualizar o associado atual para a nova ordem
    const { error: updateError } = await supabase
      .from("associates")
      .update({ order: newOrder, updated_at: new Date().toISOString() })
      .eq("id", associateId);

    if (updateError) {
      return NextResponse.json(
        { error: "Erro ao atualizar ordem do associado" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao reordenar associado:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao reordenar associado" },
      { status: 500 }
    );
  }
}

