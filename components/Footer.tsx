"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const supabase = createClient();
        const [footerData, siteData] = await Promise.all([
          supabase.from("footer_settings").select("*, background_image_url").single(),
          supabase.from("site_settings").select("logo_white_url, site_name, site_description").single(),
        ]);
        
        if (footerData.data) {
          setFooterSettings(footerData.data);
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
    <footer 
      className="text-white relative overflow-hidden"
      style={{
        backgroundColor: footerSettings?.background_image_url ? 'transparent' : '#111827',
        backgroundImage: footerSettings?.background_image_url 
          ? `url(${footerSettings.background_image_url})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay escuro para melhorar legibilidade do texto */}
      {footerSettings?.background_image_url && (
        <div className="absolute inset-0 bg-gray-900/80"></div>
      )}
      
      <div className="relative w-full px-8 py-16">
        <div className="flex justify-between items-start h-full min-h-[200px]">
          {/* Lado Esquerdo - Logo e Informações */}
          <div className="flex items-start gap-8">
            {/* Logo */}
            {siteSettings?.logo_white_url && (
              <div className="flex-shrink-0">
                <div className="relative h-24 w-24">
                  <Image
                    src={siteSettings.logo_white_url}
                    alt={siteSettings.site_name || "ABCIP"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Textos */}
            <div className="flex flex-col justify-start">
              {/* Descrição da Empresa */}
              {siteSettings?.site_description && (
                <p className="text-white text-base leading-relaxed mb-4 max-w-md">
                  {siteSettings.site_description}
                </p>
              )}

              {/* Endereço */}
              {footerSettings?.address && (
                <p className="text-white text-base leading-relaxed whitespace-pre-line">
                  {footerSettings.address}
                </p>
              )}
            </div>
          </div>

          {/* Lado Direito - Redes Sociais e Contatos */}
          <div className="flex flex-col items-end">
            {/* Redes Sociais */}
            <div className="flex items-center gap-3 mb-2">
              {footerSettings?.linkedin && (
                <a
                  href={footerSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-gray-900" />
                </a>
              )}
              {footerSettings?.instagram && (
                <a
                  href={footerSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6 text-gray-900" />
                </a>
              )}
              {footerSettings?.facebook && (
                <a
                  href={footerSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6 text-gray-900" />
                </a>
              )}
              {footerSettings?.youtube && (
                <a
                  href={footerSettings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-6 h-6 text-gray-900" />
                </a>
              )}
            </div>

            {/* Contatos bem embaixo dos ícones */}
            <div className="flex flex-col items-end">
              {footerSettings?.phone && (
                <p className="text-white text-base mb-1">
                  {footerSettings.phone}
                </p>
              )}
              {footerSettings?.email && (
                <a 
                  href={`mailto:${footerSettings.email}`} 
                  className="text-white text-base hover:underline"
                >
                  {footerSettings.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
