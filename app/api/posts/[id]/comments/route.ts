import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Buscar comentários de uma notícia
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Resolve params se for Promise (Next.js 15) ou usa diretamente (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const postId = resolvedParams.id;

    const { data: comments, error } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ comments: comments || [] });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

// POST - Criar novo comentário
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Resolve params se for Promise (Next.js 15) ou usa diretamente (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const postId = resolvedParams.id;

    const body = await request.json();
    const { author_name, content } = body;

    // Validação
    if (!author_name || !content) {
      return NextResponse.json(
        { error: "Nome e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    if (author_name.trim().length < 2) {
      return NextResponse.json(
        { error: "O nome deve ter pelo menos 2 caracteres" },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: "O comentário deve ter pelo menos 3 caracteres" },
        { status: 400 }
      );
    }

    // Verificar se o post existe
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .eq("published", true)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    // Criar comentário
    const { data: comment, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: postId,
        author_name: author_name.trim(),
        content: content.trim(),
        approved: true, // Aprovar automaticamente (pode ser mudado para false se quiser moderação)
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar comentário" },
      { status: 500 }
    );
  }
}

