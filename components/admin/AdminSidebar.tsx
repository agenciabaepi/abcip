"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  Info,
  MessageSquare,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/posts", label: "Notícias", icon: FileText },
    { href: "/admin/banners", label: "Banners", icon: Image },
    { href: "/admin/associates", label: "Associados", icon: Users },
    { href: "/admin/about", label: "Quem Somos", icon: Info },
    { href: "/admin/board", label: "Diretoria", icon: Users },
    { href: "/admin/team", label: "Equipe", icon: Users },
    { href: "/admin/messages", label: "Mensagens", icon: MessageSquare },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">ABCIP Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.href)
                    ? "bg-primary-500 text-dark-900"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

