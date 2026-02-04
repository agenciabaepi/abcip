import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.trim() : "";

    if (!path) {
      return NextResponse.json(
        { error: "path é obrigatório" },
        { status: 400 }
      );
    }

    // Não registrar visualizações do painel admin
    if (path.startsWith("/admin")) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("site_views").insert({
      path: path || "/",
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Erro ao registrar visualização:", error);
    return NextResponse.json(
      { error: "Erro ao registrar visualização" },
      { status: 500 }
    );
  }
}
