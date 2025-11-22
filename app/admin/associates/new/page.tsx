import { requireAuth } from "@/lib/auth";
import AssociateEditor from "@/components/admin/AssociateEditor";

export default async function NewAssociatePage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Novo Associado</h1>
      <AssociateEditor />
    </div>
  );
}

