import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import VideoEditor from "@/components/admin/VideoEditor";

export default async function EditVideoPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAuth();

  const supabase = await createClient();
  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!video) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Vídeo</h1>
      <VideoEditor video={video} />
    </div>
  );
}

