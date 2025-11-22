import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import AssociateEditor from "@/components/admin/AssociateEditor";

export default async function EditAssociatePage({
  params,
}: {
  params: { id: string };
}) {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: associate } = await supabase
    .from("associates")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!associate) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Associado</h1>
      <AssociateEditor associate={associate} />
    </div>
  );
}

