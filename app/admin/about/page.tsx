import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import AboutEditor from "@/components/admin/AboutEditor";

export default async function AboutPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: aboutPage } = await supabase
    .from("about_page")
    .select("*")
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Quem Somos</h1>
      <AboutEditor aboutPage={aboutPage} />
    </div>
  );
}

