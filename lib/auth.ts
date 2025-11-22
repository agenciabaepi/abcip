import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Verifica se o usuário está autenticado
 * Se não estiver, redireciona para /admin/login
 * Use esta função em todas as páginas do admin como camada extra de segurança
 * 
 * IMPORTANTE: Esta função SEMPRE redireciona se não houver autenticação válida
 */
export async function requireAuth() {
  try {
    const supabase = await createClient();
    
    // Tenta obter o usuário diretamente
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Auth error in requireAuth:", error.message, error.status);
    }
    
    if (user) {
      return user;
    }
    
    // Se não houver usuário, redireciona
    console.error("No user found in requireAuth, redirecting");
    redirect("/admin/login");
  } catch (error: any) {
    // Se for um erro de redirect do Next.js, propaga
    if (error?.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    // Qualquer outro erro = redireciona para login (segurança máxima)
    console.error("Authentication error:", error);
    redirect("/admin/login");
  }
}

