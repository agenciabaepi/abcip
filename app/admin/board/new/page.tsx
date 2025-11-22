import { requireAuth } from "@/lib/auth";
import MemberEditor from "@/components/admin/MemberEditor";

export default async function NewBoardMemberPage() {
  await requireAuth();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Novo Membro da Diretoria</h1>
      <MemberEditor type="board" />
    </div>
  );
}

