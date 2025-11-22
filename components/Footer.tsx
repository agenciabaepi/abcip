"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const supabase = createClient();
        const [footerData, siteData] = await Promise.all([
          supabase.from("footer_settings").select("*").single(),
          supabase.from("site_settings").select("logo_white_url, site_name").single(),
        ]);
        
        if (footerData.data) {
          setFooterSettings(footerData.data);
          setLinks(footerData.data.links ? JSON.parse(footerData.data.links) : []);
        }
        
        if (siteData.data) {
          setSiteSettings(siteData.data);
        }
      } catch (error) {
        console.warn("Não foi possível carregar configurações do rodapé:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFooterSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <Link href="/" className="inline-block mb-3 sm:mb-4">
              {siteSettings?.logo_white_url ? (
                <div className="relative h-10 sm:h-12 w-auto">
                  <img
                    src={siteSettings.logo_white_url}
                    alt={siteSettings.site_name || "ABCIP"}
                    className="h-full w-auto object-contain"
                    style={{ maxWidth: "200px" }}
                    onError={(e) => {
                      // Se o logo falhar ao carregar, mostra o texto
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement("span");
                        fallback.className = "text-xl sm:text-2xl font-bold text-white";
                        fallback.textContent = siteSettings?.site_name || "ABCIP";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ) : (
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {siteSettings?.site_name || "ABCIP"}
                </h3>
              )}
            </Link>
            <p className="text-sm sm:text-base text-gray-400">
              Concessionária de Iluminação Pública
            </p>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Links Úteis</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm sm:text-base text-gray-400 hover:text-white transition">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-sm sm:text-base text-gray-400 hover:text-white transition">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="text-sm sm:text-base text-gray-400 hover:text-white transition">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm sm:text-base text-gray-400 hover:text-white transition">
                  Contato
                </Link>
              </li>
              {links.map((link: { label: string; url: string }, index: number) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-sm sm:text-base text-gray-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Contato</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              {footerSettings?.address && (
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{footerSettings.address}</span>
                </li>
              )}
              {footerSettings?.phone && (
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{footerSettings.phone}</span>
                </li>
              )}
              {footerSettings?.email && (
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{footerSettings.email}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Redes Sociais</h4>
            <div className="flex space-x-3 sm:space-x-4">
              {footerSettings?.facebook && (
                <a
                  href={footerSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {footerSettings?.instagram && (
                <a
                  href={footerSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {footerSettings?.linkedin && (
                <a
                  href={footerSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {footerSettings?.twitter && (
                <a
                  href={footerSettings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ABCIP. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

