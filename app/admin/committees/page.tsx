import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { StrategicCommittee } from "@/lib/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import DeleteCommitteeButton from "@/components/admin/DeleteCommitteeButton";

export default async function CommitteesPage() {
  await requireAuth();
  
  const supabase = await createClient();
  const { data: committees } = await supabase
    .from("strategic_committees")
    .select("*")
    .order("order", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Comitês Estratégicos</h1>
        <Link
          href="/admin/committees/new"
          className="flex items-center space-x-2 bg-primary-500 text-dark-900 px-4 py-2 rounded-lg hover:bg-primary-400 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Comitê</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committees && committees.length > 0 ? (
          (committees as StrategicCommittee[]).map((committee) => (
            <div key={committee.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full bg-dark-900">
                {committee.image_url ? (
                  <Image
                    src={committee.image_url}
                    alt={committee.name}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {committee.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{committee.name}</h3>
                {committee.leader_name && (
                  <p className="text-sm text-gray-600 mb-3">{committee.leader_name}</p>
                )}
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/committees/${committee.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 text-dark-900 px-3 py-2 rounded hover:bg-primary-400 transition text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>
                  <DeleteCommitteeButton committeeId={committee.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum comitê estratégico cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}

