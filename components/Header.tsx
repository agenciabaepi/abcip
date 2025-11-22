"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  logoUrl?: string | null;
  siteName?: string;
}

export default function Header({ logoUrl: initialLogoUrl, siteName: initialSiteName }: HeaderProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [siteName, setSiteName] = useState<string>(initialSiteName || "ABCIP");

  // Se não recebeu logoUrl como prop, busca no cliente
  useEffect(() => {
    if (!initialLogoUrl) {
      const fetchSettings = async () => {
        try {
          const supabase = createClient();
          const { data: siteSettings } = await supabase
            .from("site_settings")
            .select("logo_url, site_name")
            .single();

          if (siteSettings) {
            setLogoUrl(siteSettings.logo_url || null);
            setSiteName(siteSettings.site_name || "ABCIP");
          }
        } catch (error) {
          console.warn("Não foi possível carregar configurações:", error);
        }
      };
      fetchSettings();
    }
  }, [initialLogoUrl]);
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/noticias", label: "Notícias" },
    { href: "/quem-somos", label: "Quem Somos" },
    { href: "/associados", label: "Associados" },
    { href: "/contato", label: "Contato" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center flex-1">
            <Link href="/" className="flex items-center">
              {logoUrl ? (
                <div className="relative h-10 md:h-12 w-auto">
                  <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-full w-auto object-contain"
                    style={{ maxWidth: "200px" }}
                    onError={(e) => {
                      // Se o logo falhar ao carregar, mostra o texto
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement("span");
                        fallback.className = "text-xl md:text-2xl font-bold text-dark-900 tracking-tight";
                        fallback.textContent = siteName;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ) : (
                <span className="text-xl md:text-2xl font-bold text-dark-900 tracking-tight">
                  {siteName}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-dark-900"
                    : "text-gray-600 hover:text-dark-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center ml-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-48 lg:w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </form>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-dark-900 transition"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden ml-2 p-2 text-gray-600 hover:text-dark-900 transition"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "text-dark-900 bg-primary-50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-dark-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

