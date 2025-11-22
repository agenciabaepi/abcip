import { createClient } from "@/lib/supabase/server";
import Header from "./Header";

export default async function HeaderWrapper() {
  let logoUrl: string | null = null;
  let logoWhiteUrl: string | null = null;
  let siteName: string = "ABCIP";

  try {
    const supabase = await createClient();
    const { data: siteSettings } = await supabase
      .from("site_settings")
      .select("logo_url, logo_white_url, site_name")
      .single();

    if (siteSettings) {
      logoUrl = siteSettings.logo_url || null;
      logoWhiteUrl = siteSettings.logo_white_url || null;
      siteName = siteSettings.site_name || "ABCIP";
    }
  } catch (error) {
    console.warn("Não foi possível carregar configurações do site:", error);
  }

  return <Header logoUrl={logoUrl} logoWhiteUrl={logoWhiteUrl} siteName={siteName} />;
}

