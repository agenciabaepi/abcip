"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ABCIPText from "@/components/ABCIPText";

interface NavLink {
  href: string;
  label: string;
  hasDropdown?: boolean;
  dropdownItems?: { href: string; label: string }[];
}

interface HeaderProps {
  logoUrl?: string | null;
  logoWhiteUrl?: string | null;
  siteName?: string;
}

export default function Header({ logoUrl: initialLogoUrl, logoWhiteUrl: initialLogoWhiteUrl, siteName: initialSiteName }: HeaderProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [logoWhiteUrl, setLogoWhiteUrl] = useState<string | null>(initialLogoWhiteUrl || null);
  const [siteName, setSiteName] = useState<string>(initialSiteName || "ABCIP");

  // Se não recebeu logoUrl como prop, busca no cliente
  useEffect(() => {
    if (!initialLogoUrl) {
      const fetchSettings = async () => {
        try {
          const supabase = createClient();
          const { data: siteSettings } = await supabase
            .from("site_settings")
            .select("logo_url, logo_white_url, site_name")
            .single();

          if (siteSettings) {
            setLogoUrl(siteSettings.logo_url || null);
            setLogoWhiteUrl(siteSettings.logo_white_url || null);
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

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const navLinks: NavLink[] = [
    { href: "/", label: "home" },
    { href: "/quem-somos", label: "quem somos" },
    { 
      href: "/noticias", 
      label: "notícias", 
      hasDropdown: true,
      dropdownItems: [
        { href: "/noticias", label: "Todas as Notícias" },
        { href: "/noticias/videos", label: "Vídeos" },
      ]
    },
    { href: "/associados", label: "associados" },
    { href: "/contato", label: "contato" },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className="flex items-center h-28 md:h-32">
          {/* Logo - Esquerda */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-12">
              {logoUrl ? (
                <div className="relative h-20 md:h-24 w-auto">
                  <img
                    src={logoUrl}
                    alt={siteName}
                    className="h-full w-auto object-contain"
                    style={{ maxWidth: "350px" }}
                    onError={(e) => {
                      // Se o logo falhar ao carregar, mostra o texto
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement("span");
                        fallback.className = "text-4xl md:text-5xl font-bold text-dark-900 tracking-tight";
                        fallback.textContent = siteName;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-dark-900 tracking-tight">
                  <ABCIPText>{siteName}</ABCIPText>
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation - Centro */}
          <nav className="hidden lg:flex items-center justify-center flex-grow space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isDropdownOpen = openDropdown === link.href;
              
              if (link.hasDropdown && link.dropdownItems) {
                return (
                  <div
                    key={link.href}
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(link.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={`text-2xl font-medium transition-colors relative pb-1 whitespace-nowrap flex items-center gap-1 ${
                        active
                          ? "text-primary-400"
                          : "text-dark-900"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      {active && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-dark-900"></span>
                      )}
                    </Link>
                    
                    {/* Dropdown Menu */}
                    <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 transition-all duration-200 ${
                      isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl font-medium transition-colors relative pb-1 whitespace-nowrap ${
                    active
                      ? "text-primary-400"
                      : "text-dark-900"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-dark-900"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search - Direita */}
          <div className="flex items-center justify-end flex-1">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
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
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const isMobileDropdownOpen = openDropdown === `mobile-${link.href}`;
                
                if (link.hasDropdown && link.dropdownItems) {
                  return (
                    <div key={link.href}>
                      <button
                        onClick={() => setOpenDropdown(isMobileDropdownOpen ? null : `mobile-${link.href}`)}
                        className={`w-full px-4 py-3 text-xl font-medium rounded-lg transition-colors flex items-center justify-between ${
                          active
                            ? "text-primary-400 bg-primary-50"
                            : "text-dark-900 hover:bg-gray-50"
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isMobileDropdownOpen && (
                        <div className="pl-4 mt-1 space-y-1">
                          {link.dropdownItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                              className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActive(item.href)
                                  ? "text-primary-400 bg-primary-50"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-xl font-medium rounded-lg transition-colors flex items-center gap-2 ${
                      active
                        ? "text-primary-400 bg-primary-50"
                        : "text-dark-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

