import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { Associate } from "@/lib/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import DeleteAssociateButton from "@/components/admin/DeleteAssociateButton";

export default async function AssociatesPage() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();
  const { data: associates } = await supabase
    .from("associates")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Associados</h1>
        <Link
          href="/admin/associates/new"
          className="flex items-center space-x-2 bg-primary-500 text-dark-900 px-4 py-2 rounded-lg hover:bg-primary-400 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Associado</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {associates && associates.length > 0 ? (
          (associates as Associate[]).map((associate) => (
            <div key={associate.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="relative h-32 w-full mb-4">
                <Image
                  src={associate.logo_url}
                  alt={associate.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{associate.name}</h3>
              {associate.website && (
                <a
                  href={associate.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-500 hover:text-primary-600 mb-4 block"
                >
                  {associate.website}
                </a>
              )}
              <div className="flex space-x-2">
                <Link
                  href={`/admin/associates/${associate.id}`}
                  className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 text-dark-900 px-3 py-2 rounded hover:bg-primary-400 transition text-sm font-semibold"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </Link>
                <DeleteAssociateButton associateId={associate.id} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum associado cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}

