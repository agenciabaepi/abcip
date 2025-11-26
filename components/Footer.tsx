"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteSettings, FooterSettings } from "@/lib/types";
import Image from "next/image";

// Pequeno componente auxiliar para os ícones circulares (mantém consistência)
function IconCircle({ children, href }: { children: React.ReactNode; href?: string }) {
  const content = (
    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer">
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

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
      {/* Container com imagem de fundo e overlay escuro sutil */}
      <div
        className="relative w-full h-36 sm:h-44 md:h-52 lg:h-56 overflow-hidden bg-center bg-cover rounded-b-md"
        style={{ 
          backgroundImage: footerSettings?.background_image_url 
            ? `url('${footerSettings.background_image_url}')` 
            : `url('/images/Captura-de-Tela-footer.jpg')`
        }}
        aria-label="Rodapé ABCIP"
      >
        {/* Overlay para escurecer a imagem (igual ao original) */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Conteúdo do footer: três colunas (left / center / right) */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-8 lg:px-12 flex items-center">
          {/* Left: logo + título + descrição (alinhado à esquerda) */}
          <div className="flex-1 flex items-start gap-4">
            <div className="flex items-center gap-4">
              {/* Logo do Supabase ou placeholder SVG */}
              {siteSettings?.logo_white_url ? (
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full">
                  <div className="relative w-8 h-8">
                    <Image
                      src={siteSettings.logo_white_url}
                      alt={siteSettings.site_name || "ABCIP"}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full">
                  <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle cx="32" cy="32" r="32" fill="white" fillOpacity="0.06" />
                    <g transform="translate(8 8)" fill="white">
                      <circle cx="8" cy="8" r="6" fillOpacity="1" />
                      <circle cx="30" cy="30" r="4" fillOpacity="1" />
                    </g>
                  </svg>
                </div>
              )}

              <div className="text-white">
                <div className="font-semibold text-lg md:text-xl tracking-tight">
                  AB<span className="font-bold">CI</span>P
                </div>
                <div className="text-[11px] md:text-xs leading-tight mt-1 max-w-xs opacity-95">
                  {siteSettings?.site_description || (
                    <>
                      Associação Brasileira das Concessionárias de
                      <br /> Iluminação Pública e Cidades Inteligentes
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center: endereço (centralizado verticalmente e posicionado mais ao centro) */}
          <div className="flex-1 flex flex-col items-center text-center text-white">
            {footerSettings?.address ? (
              footerSettings.address.split('\n').map((line, index) => (
                <div key={index} className={index === 0 ? "text-sm md:text-base font-medium" : "text-xs md:text-sm mt-1 opacity-90"}>
                  {line}
                </div>
              ))
            ) : (
              <>
                <div className="text-sm md:text-base font-medium">Rua Augusta, 2840, 5º Andar</div>
                <div className="text-xs md:text-sm mt-1 opacity-90">São Paulo - SP - 01412-100</div>
              </>
            )}
          </div>

          {/* Right: ícones e contato (alinhado à direita) */}
          <div className="flex-1 flex flex-col items-end">
            <div className="flex items-center gap-3 mb-1">
              {/* pequenos círculos escuros com ícones brancos — ordem: LinkedIn, Instagram, Facebook, YouTube */}
              {footerSettings?.linkedin && (
                <IconCircle href={footerSettings.linkedin}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5z" fill="white"/>
                    <path d="M6 8h4v12H6zM12 8h4v1.7c.6-1 2.2-2.1 4.5-2.1 4.8 0 5.5 3.2 5.5 7.4V20h-4v-6.5c0-1.6 0-3.6-2.2-3.6-2.2 0-2.5 1.7-2.5 3.5V20h-4V8z" fill="white"/>
                  </svg>
                </IconCircle>
              )}

              {footerSettings?.instagram && (
                <IconCircle href={footerSettings.instagram}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1" />
                    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1" />
                    <circle cx="17.5" cy="6.5" r="1" fill="white" />
                  </svg>
                </IconCircle>
              )}

              {footerSettings?.facebook && (
                <IconCircle href={footerSettings.facebook}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34V21.9C18.34 21.13 22 17 22 12z" fill="white"/>
                  </svg>
                </IconCircle>
              )}

              {footerSettings?.youtube && (
                <IconCircle href={footerSettings.youtube}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-1C16.3 2 12 2 12 2s-4.3 0-8.6.8c-.4 0-1.3.1-2.1 1-.6.7-.8 2.4-.8 2.4S0 8 0 9.8v2.4C0 14 0.2 15.8.2 15.8s.2 1.7.8 2.4c.8.9 1.9.9 2.4 1 1.7.2 7.6.8 8.6.8s4.3 0 8.6-.8c.4 0 1.3-.1 2.1-1 .6-.7.8-2.4.8-2.4s.2-1.8.2-3.6v-2.4c0-1.8-.2-3.6-.2-3.6z" fill="white" />
                    <path d="M9.6 15.1l5.2-3.1-5.2-3.1v6.2z" fill="#0b1220" />
                  </svg>
                </IconCircle>
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