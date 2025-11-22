import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { TeamMember } from "@/lib/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import DeleteTeamMemberButton from "@/components/admin/DeleteTeamMemberButton";

export default async function TeamPage() {
  await requireAuth();
  
  const supabase = await createClient();
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("*")
    .order("order", { ascending: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Equipe</h1>
        <Link
          href="/admin/team/new"
          className="flex items-center space-x-2 bg-primary-500 text-dark-900 px-4 py-2 rounded-lg hover:bg-primary-400 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Membro</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teamMembers && teamMembers.length > 0 ? (
          (teamMembers as TeamMember[]).map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full bg-gray-100">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                    <span className="text-3xl font-bold text-primary-500">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-primary-500 mb-3">{member.position}</p>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 text-dark-900 px-3 py-2 rounded hover:bg-primary-400 transition text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>
                  <DeleteTeamMemberButton memberId={member.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum membro da equipe cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}

