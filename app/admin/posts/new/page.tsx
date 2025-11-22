import { requireAuth } from "@/lib/auth";
import PostEditor from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nova Notícia</h1>
      <PostEditor />
    </div>
  );
}

