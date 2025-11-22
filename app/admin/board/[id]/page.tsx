import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import MemberEditor from "@/components/admin/MemberEditor";

export default async function EditBoardMemberPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAuth();
  
  const supabase = await createClient();
  const { data: member } = await supabase
    .from("board_members")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!member) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Membro da Diretoria</h1>
      <MemberEditor member={member} type="board" />
    </div>
  );
}

