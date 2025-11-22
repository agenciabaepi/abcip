import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { Banner } from "@/lib/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import DeleteBannerButton from "@/components/admin/DeleteBannerButton";

const BannerImage = dynamic(() => import("@/components/admin/BannerImage"), {
  ssr: false,
});

export default async function BannersPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("order", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Banners</h1>
        <Link
          href="/admin/banners/new"
          className="flex items-center space-x-2 bg-primary-500 text-dark-900 px-4 py-2 rounded-lg hover:bg-primary-400 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Banner</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners && banners.length > 0 ? (
          (banners as Banner[]).map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <BannerImage src={banner.image_url} alt={banner.title || "Banner"} />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {banner.title || "Sem título"}
                </h3>
                {banner.subtitle && (
                  <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                )}
                <p className="text-xs text-gray-500 mb-4">
                  Ordem: {banner.order}
                </p>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/banners/${banner.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 text-dark-900 px-3 py-2 rounded hover:bg-primary-400 transition text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>
                  <DeleteBannerButton bannerId={banner.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum banner cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}

