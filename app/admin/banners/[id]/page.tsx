import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import BannerEditor from "@/components/admin/BannerEditor";

export default async function EditBannerPage({
  params,
}: {
  params: { id: string };
}) {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: banner } = await supabase
    .from("banners")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!banner) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Banner</h1>
      <BannerEditor banner={banner} />
    </div>
  );
}

