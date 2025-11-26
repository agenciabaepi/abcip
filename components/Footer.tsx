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
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="relative min-h-[300px] lg:min-h-[400px]">
          {/* Logo e Informações - Lado Esquerdo */}
          <div className="flex flex-col items-start">
            {/* Logo - Muito Grande */}
            {siteSettings?.logo_white_url && (
              <div className="mb-6">
                <div className="relative h-40 w-40 md:h-52 md:w-52 lg:h-60 lg:w-60">
                  <Image
                    src={siteSettings.logo_white_url}
                    alt={siteSettings.site_name || "ABCIP"}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Descrição da Empresa */}
            {siteSettings?.site_description && (
              <p className="text-[15px] text-white leading-relaxed mb-4 max-w-lg text-left">
                {siteSettings.site_description}
              </p>
            )}

            {/* Endereço */}
            {footerSettings?.address && (
              <p className="text-[15px] text-white leading-relaxed whitespace-pre-line text-left">
                {footerSettings.address}
              </p>
            )}
          </div>

          {/* Redes Sociais e Contato - Canto Inferior Direito */}
          <div className="absolute bottom-0 right-0 flex flex-col items-end">
            {/* Telefone */}
            {footerSettings?.phone && (
              <p className="text-lg text-white mb-4 text-right">
                {footerSettings.phone}
              </p>
            )}

            {/* Email */}
            {footerSettings?.email && (
              <a 
                href={`mailto:${footerSettings.email}`} 
                className="text-lg text-white hover:underline text-right mb-6"
              >
                {footerSettings.email}
              </a>
            )}

            {/* Redes Sociais - Maiores */}
            <div className="flex items-center gap-4">
              {footerSettings?.linkedin && (
                <a
                  href={footerSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-7 h-7 text-gray-900" />
                </a>
              )}
              {footerSettings?.instagram && (
                <a
                  href={footerSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-7 h-7 text-gray-900" />
                </a>
              )}
              {footerSettings?.facebook && (
                <a
                  href={footerSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-7 h-7 text-gray-900" />
                </a>
              )}
              {footerSettings?.youtube && (
                <a
                  href={footerSettings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-7 h-7 text-gray-900" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
