import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica se estamos na página de login através dos headers
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login";

  // Se estiver na página de login, não verifica autenticação e retorna apenas o children
  // O layout do login (app/admin/login/layout.tsx) já cuida do layout específico
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Verificação de autenticação obrigatória - SEM EXCEÇÕES
  // Esta é a primeira camada de segurança (layout)
  let user = null;
  
  try {
    const supabase = await createClient();
    
    // Tenta obter o usuário diretamente
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Auth error in layout:", error.message, error.status);
    }
    
    user = data?.user;
    
    // Se não houver usuário, redireciona
    if (!user) {
      console.error("No user found, redirecting to login");
      redirect("/admin/login");
    }
  } catch (error: any) {
    // Se for um erro de redirect do Next.js, propaga
    if (error?.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    // Qualquer outro erro na autenticação = redireciona para login
    console.error("Authentication check failed:", error);
    redirect("/admin/login");
  }

  // Se não houver usuário autenticado, redireciona
  if (!user) {
    redirect("/admin/login");
  }

  // Só renderiza o painel se houver usuário autenticado
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

