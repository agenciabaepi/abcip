"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteSettings, FooterSettings } from "@/lib/types";
import Image from "next/image";

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const supabase = createClient();
        
        const [{ data: footerData }, { data: siteData }] = await Promise.all([
          supabase.from("footer_settings").select("*").single(),
          supabase.from("site_settings").select("*").single()
        ]);

        if (footerData) {
          setFooterSettings(footerData);
        }
        if (siteData) {
          setSiteSettings(siteData);
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
    <footer className="w-full">
      <div
        className="relative w-full h-40 md:h-44 lg:h-48 overflow-hidden bg-center bg-cover"
        style={{ 
          backgroundImage: footerSettings?.background_image_url 
            ? `url('${footerSettings.background_image_url}')` 
            : `url('/images/footer-bg.jpg')`
        }}
        aria-label="Rodapé ABCIP"
      >
        {/* Overlay to darken image for contrast */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 h-full flex items-center">
          {/* Left: logo + address */}
          <div className="flex-1 text-white flex items-start gap-6">
            <div className="flex items-center gap-4">
              {/* Logo from Supabase or fallback */}
              {siteSettings?.logo_white_url ? (
                <div className="shrink-0">
                  <div className="relative h-16 w-16">
                    <Image
                      src={siteSettings.logo_white_url}
                      alt={siteSettings.site_name || "ABCIP"}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="shrink-0">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle cx="32" cy="32" r="32" fill="#0b1220" fillOpacity="0.08" />
                    <g transform="translate(6 6)" fill="white">
                      <circle cx="10" cy="10" r="10" fillOpacity="0.95" />
                      <circle cx="34" cy="34" r="6" fillOpacity="0.95" />
                    </g>
                  </svg>
                </div>
              )}

              <div className="leading-tight">
                <div className="text-2xl md:text-3xl font-bold tracking-tight">
                  AB<span className="font-bold">CI</span>P
                </div>
                <div className="text-xs md:text-sm opacity-90 mt-1 max-w-xs">
                  {siteSettings?.site_description || (
                    <>
                      Associação Brasileira das Concessionárias
                      <br /> de Iluminação Pública e Cidades Inteligentes
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="ml-2 hidden md:block text-sm md:text-base leading-relaxed">
              {footerSettings?.address ? (
                footerSettings.address.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))
              ) : (
                <>
                  <div>Rua Augusta, 2840, 5º Andar</div>
                  <div>São Paulo - SP - 01412-100</div>
                </>
              )}
            </div>
          </div>

          {/* Right: social icons + contact */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4">
              {/* Social icons in exact sequence: LinkedIn, Instagram, Facebook, YouTube */}
              {footerSettings?.linkedin && (
                <a href={footerSettings.linkedin} className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5z" fill="white" opacity="0.95"/>
                    <path d="M6 8h4v12H6zM12 8h4v1.7c.6-1 2.2-2.1 4.5-2.1 4.8 0 5.5 3.2 5.5 7.4V20h-4v-6.5c0-1.6 0-3.6-2.2-3.6-2.2 0-2.5 1.7-2.5 3.5V20h-4V8z" fill="white" opacity="0.95"/>
                  </svg>
                </a>
              )}

              {footerSettings?.instagram && (
                <a href={footerSettings.instagram} className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="white" />
                  </svg>
                </a>
              )}

              {footerSettings?.facebook && (
                <a href={footerSettings.facebook} className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34V21.9C18.34 21.13 22 17 22 12z" fill="white"/>
                  </svg>
                </a>
              )}

              {footerSettings?.youtube && (
                <a href={footerSettings.youtube} className="group p-2 rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-1C16.3 2 12 2 12 2s-4.3 0-8.6.8c-.4 0-1.3.1-2.1 1-.6.7-.8 2.4-.8 2.4S0 8 0.2 9.8v2.4C0 14 0.2 15.8.2 15.8s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.7.2 7.6.8 8.6.8s4.3 0 8.6-.8c.4 0 1.3-.1 2.1-1 .6-.7.8-2.4.8-2.4s.2-1.8.2-3.6v-2.4c0-1.8-.2-3.6-.2-3.6z" fill="white" />
                    <path d="M9.6 15.1l5.2-3.1-5.2-3.1v6.2z" fill="#0b1220" />
                  </svg>
                </a>
              )}
            </div>

            <div className="text-right text-sm md:text-base text-white">
              <div className="font-medium">{footerSettings?.phone || "+55 11 91304 0730"}</div>
              <div className="opacity-90">{footerSettings?.email || "contato@abcip.com.br"}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}