import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { FileText, Image, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();

  const [
    { count: postsCount },
    { count: bannersCount },
    { count: associatesCount },
    { count: messagesCount },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("banners").select("*", { count: "exact", head: true }),
    supabase.from("associates").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      title: "Notícias",
      count: postsCount || 0,
      icon: FileText,
      href: "/admin/posts",
      color: "bg-blue-500",
    },
    {
      title: "Banners",
      count: bannersCount || 0,
      icon: Image,
      href: "/admin/banners",
      color: "bg-green-500",
    },
    {
      title: "Associados",
      count: associatesCount || 0,
      icon: Users,
      href: "/admin/associates",
      color: "bg-purple-500",
    },
    {
      title: "Mensagens",
      count: messagesCount || 0,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

