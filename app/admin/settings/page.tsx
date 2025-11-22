import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import SettingsEditor from "@/components/admin/SettingsEditor";
import FooterSettingsEditor from "@/components/admin/FooterSettingsEditor";

export default async function SettingsPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: siteSettings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  const { data: footerSettings } = await supabase
    .from("footer_settings")
    .select("*")
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Configurações Gerais
          </h2>
          <SettingsEditor siteSettings={siteSettings} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Configurações do Rodapé
          </h2>
          <FooterSettingsEditor footerSettings={footerSettings} />
        </div>
      </div>
    </div>
  );
}

