import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import CommitteeEditor from "@/components/admin/CommitteeEditor";

export default async function EditCommitteePage({
  params,
}: {
  params: { id: string };
}) {
  await requireAuth();
  
  const supabase = await createClient();
  const { data: committee } = await supabase
    .from("strategic_committees")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!committee) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Comitê Estratégico</h1>
      <CommitteeEditor committee={committee} />
    </div>
  );
}

