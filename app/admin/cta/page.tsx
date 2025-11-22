import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import CTAEditor from "@/components/admin/CTAEditor";

export default async function CTAPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: cta } = await supabase
    .from("cta_section")
    .select("*")
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Seção CTA (Call to Action)</h1>
      <p className="text-gray-600 mb-6">
        Configure a seção de chamada para ação que aparece na homepage. Esta seção incentiva visitantes a se associarem à ABCIP.
      </p>
      <CTAEditor cta={cta} />
    </div>
  );
}

