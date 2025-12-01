"use client";

import { useState, useEffect } from "react";
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
  Megaphone,
  Video,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);

  // Fecha o menu quando a rota muda (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Previne scroll do body quando menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    { href: "/admin/noticias", label: "Banner Notícias", icon: Image },
    { href: "/admin/banners", label: "Banners", icon: Image },
    { href: "/admin/cta", label: "CTA Homepage", icon: Megaphone },
    { href: "/admin/videos", label: "Vídeos", icon: Video },
    { href: "/admin/publicacoes", label: "Publicações", icon: FileText },
    { href: "/admin/associates", label: "Associados", icon: Users },
    { href: "/admin/associados", label: "Banner Associados", icon: Image },
    { href: "/admin/about", label: "Quem Somos", icon: Info },
    { href: "/admin/board", label: "Diretoria", icon: Users },
    { href: "/admin/team", label: "Equipe", icon: Users },
    { href: "/admin/committees", label: "Comitês Estratégicos", icon: Users },
    { href: "/admin/contato", label: "Banner Contato", icon: Image },
    { href: "/admin/messages", label: "Mensagens", icon: MessageSquare },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <>
      {/* Botão Hambúrguer - Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-gray-900 text-white p-2 rounded-lg shadow-lg hover:bg-gray-800 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay - Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">ABCIP Admin</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition text-sm sm:text-base ${
                    isActive(item.href)
                      ? "bg-primary-500 text-dark-900"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition w-full text-sm sm:text-base"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

