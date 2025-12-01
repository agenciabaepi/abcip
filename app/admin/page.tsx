import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { 
  FileText, 
  Image, 
  Users, 
  MessageSquare, 
  Video, 
  BookOpen, 
  UserCircle,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock,
  Mail
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AdminDashboard() {
  // Verificação obrigatória de autenticação
  await requireAuth();
  
  const supabase = await createClient();

  // Buscar todas as estatísticas
  const [
    { count: postsCount, data: postsData },
    { count: publishedPostsCount },
    { count: bannersCount },
    { count: associatesCount },
    { count: messagesCount },
    { count: videosCount },
    { count: publicacoesCount },
    { count: teamCount },
    { count: boardCount },
    { count: committeesCount },
    { data: recentMessages },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact" }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("banners").select("*", { count: "exact", head: true }),
    supabase.from("associates").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact" }),
    supabase.from("videos").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("publicacoes").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
    supabase.from("board_members").select("*", { count: "exact", head: true }),
    supabase.from("strategic_committees").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  // Calcular estatísticas de engajamento
  const totalViews = postsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
  const totalLikes = postsData?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;
  const totalComments = postsData?.reduce((sum, post) => sum + (post.comments_count || 0), 0) || 0;

  const stats = [
    {
      title: "Notícias",
      count: postsCount || 0,
      subtitle: `${publishedPostsCount || 0} publicadas`,
      icon: FileText,
      href: "/admin/posts",
      color: "bg-blue-500",
    },
    {
      title: "Banners",
      count: bannersCount || 0,
      subtitle: "Ativos",
      icon: Image,
      href: "/admin/banners",
      color: "bg-green-500",
    },
    {
      title: "Associados",
      count: associatesCount || 0,
      subtitle: "Cadastrados",
      icon: Users,
      href: "/admin/associates",
      color: "bg-purple-500",
    },
    {
      title: "Mensagens",
      count: messagesCount || 0,
      subtitle: "Recebidas",
      icon: MessageSquare,
      href: "/admin/messages",
      color: "bg-orange-500",
    },
    {
      title: "Vídeos",
      count: videosCount || 0,
      subtitle: "Ativos",
      icon: Video,
      href: "/admin/videos",
      color: "bg-red-500",
    },
    {
      title: "Publicações",
      count: publicacoesCount || 0,
      subtitle: "Disponíveis",
      icon: BookOpen,
      href: "/admin/publicacoes",
      color: "bg-indigo-500",
    },
    {
      title: "Equipe",
      count: teamCount || 0,
      subtitle: "Membros",
      icon: UserCircle,
      href: "/admin/team",
      color: "bg-pink-500",
    },
    {
      title: "Diretoria",
      count: boardCount || 0,
      subtitle: "Membros",
      icon: Users,
      href: "/admin/board",
      color: "bg-cyan-500",
    },
    {
      title: "Comitês",
      count: committeesCount || 0,
      subtitle: "Estratégicos",
      icon: Users,
      href: "/admin/committees",
      color: "bg-teal-500",
    },
  ];

  const engagementStats = [
    {
      title: "Visualizações",
      count: totalViews,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Curtidas",
      count: totalLikes,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Comentários",
      count: totalComments,
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Estatísticas de Engajamento */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">Engajamento</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {engagementStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`${stat.bgColor} rounded-lg p-4 flex items-center gap-4`}
              >
                <div className={`${stat.color} p-3 rounded-lg bg-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notícias Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Notícias Recentes</h2>
            </div>
            <Link
              href="/admin/posts"
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {post.created_at
                            ? format(new Date(post.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })
                            : "Data não disponível"}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        post.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma notícia encontrada
              </p>
            )}
          </div>
        </div>

        {/* Mensagens Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Mensagens Recentes</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((message: any) => (
                <Link
                  key={message.id}
                  href="/admin/messages"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {message.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {message.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {message.created_at
                            ? format(new Date(message.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })
                            : "Data não disponível"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma mensagem recebida
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

