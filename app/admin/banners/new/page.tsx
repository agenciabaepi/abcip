import { requireAuth } from "@/lib/auth";
import BannerEditor from "@/components/admin/BannerEditor";

export default async function NewBannerPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Novo Banner</h1>
      <BannerEditor />
    </div>
  );
}

