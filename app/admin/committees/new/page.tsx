import { requireAuth } from "@/lib/auth";
import CommitteeEditor from "@/components/admin/CommitteeEditor";

export default async function NewCommitteePage() {
  await requireAuth();
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Novo Comitê Estratégico</h1>
      <CommitteeEditor />
    </div>
  );
}

