import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verifica a sessão primeiro
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("API - Session check:", session ? "exists" : "missing", sessionError?.message);
    
    // Verifica se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("API - User check:", user ? `authenticated as ${user.email}` : "not authenticated", authError?.message);
    
    if (authError || !user) {
      console.error("API - Auth failed:", authError);
      return NextResponse.json(
        { error: "Não autorizado. Faça login novamente." },
        { status: 401 }
      );
    }

    console.log("API - User ID:", user.id);

    const body = await request.json();
    const { image_url, title, subtitle, link, order, enable_zoom } = body;

    console.log("API - Inserting banner with data:", { image_url, title, subtitle, link, order, enable_zoom });

    // Insere o banner usando o cliente do servidor (que tem a sessão correta)
    const { data, error } = await supabase
      .from("banners")
      .insert({
        image_url,
        title: title || null,
        subtitle: subtitle || null,
        link: link || null,
        order: order || 0,
        enable_zoom: enable_zoom !== undefined ? enable_zoom : true,
      })
      .select()
      .single();

    if (error) {
      console.error("API - Database error:", error);
      console.error("API - Error code:", error.code);
      console.error("API - Error details:", error.details);
      console.error("API - Error hint:", error.hint);
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: 400 }
      );
    }

    console.log("API - Banner inserted successfully:", data);
    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    console.error("API - Exception:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar banner" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verifica se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login novamente." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, image_url, title, subtitle, link, order, enable_zoom } = body;

    // Atualiza o banner usando o cliente do servidor
    const { data, error } = await supabase
      .from("banners")
      .update({
        image_url,
        title: title || null,
        subtitle: subtitle || null,
        link: link || null,
        order: order || 0,
        enable_zoom: enable_zoom !== undefined ? enable_zoom : true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar banner" },
      { status: 500 }
    );
  }
}

