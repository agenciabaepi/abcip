import { requireAuth } from "@/lib/auth";
import VideoEditor from "@/components/admin/VideoEditor";

export default async function NewVideoPage() {
  await requireAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Novo Vídeo</h1>
      <VideoEditor />
    </div>
  );
}

