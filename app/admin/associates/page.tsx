import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { Associate } from "@/lib/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import DeleteAssociateButton from "@/components/admin/DeleteAssociateButton";
import BulkUploadAssociates from "@/components/admin/BulkUploadAssociates";
import AssociatesList from "@/components/admin/AssociatesList";
import DeleteAllAssociatesButton from "@/components/admin/DeleteAllAssociatesButton";

export default async function AssociatesPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: associates } = await supabase
    .from("associates")
    .select("*")
    .order("order", { ascending: true })
    .order("created_at", { ascending: true });

  const associatesList = (associates as Associate[]) || [];
  const associatesCount = associatesList.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Associados</h1>
        <div className="flex items-center gap-4">
          <DeleteAllAssociatesButton count={associatesCount} />
          <Link
            href="/admin/associates/new"
            className="flex items-center space-x-2 bg-primary-500 text-dark-900 px-4 py-2 rounded-lg hover:bg-primary-400 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Associado</span>
          </Link>
        </div>
      </div>

      <BulkUploadAssociates />

      <AssociatesList associates={associatesList} />
    </div>
  );
}

