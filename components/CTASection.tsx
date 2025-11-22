"use client";

import Link from "next/link";
import { CTASection as CTASectionType } from "@/lib/types";

interface CTASectionProps {
  cta: CTASectionType;
}

export default function CTASection({ cta }: CTASectionProps) {
  // Debug: verificar se a CTA está chegando
  if (typeof window !== 'undefined') {
    console.log("CTASection received:", cta);
  }
  
  if (!cta) {
    return null;
  }
  
  // Verifica se está ativa (já foi filtrado no servidor, mas garantimos aqui também)
  if (!cta.active) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-8 md:py-10 lg:py-12">
      {/* Gradiente de fundo principal com múltiplas camadas */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#031C30] via-[#052a45] to-[#031C30]" />
      
      {/* Gradiente radial animado - efeito de brilho */}
      <div className="absolute inset-0 bg-gradient-radial from-[#5FE074]/10 via-[#5FE074]/5 to-transparent opacity-50" 
           style={{
             background: 'radial-gradient(circle at 30% 50%, rgba(95, 224, 116, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(95, 224, 116, 0.1) 0%, transparent 50%)'
           }}
      />
      
      {/* Padrão de grid sutil */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}
      />
      
      {/* Efeitos de brilho animados */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5FE074]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5FE074]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Imagem - Lado Esquerdo */}
          {cta.image_url && (
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[3/4] max-h-80 rounded-xl overflow-hidden shadow-2xl group">
                {/* Gradiente na imagem */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#031C30]/40 via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#5FE074]/10 to-transparent z-10" />
                
                <img
                  src={cta.image_url}
                  alt={cta.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    console.error("Error loading CTA image:", cta.image_url);
                    e.currentTarget.style.display = "none";
                  }}
                />
                
                {/* Borda brilhante sutil */}
                <div className="absolute inset-0 rounded-xl border border-[#5FE074]/20 z-10 pointer-events-none" />
              </div>
              
              {/* Sombra colorida decorativa */}
              <div className="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-[#5FE074]/20 rounded-xl blur-xl" />
            </div>
          )}

          {/* Conteúdo - Lado Direito */}
          <div className={`order-1 lg:order-2 relative z-10 ${!cta.image_url ? 'lg:col-span-2 text-center' : ''}`}>
            {/* Efeito de brilho no texto */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight tracking-tight drop-shadow-lg">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                {cta.title}
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed max-w-2xl drop-shadow-md">
              {cta.description}
            </p>

            {cta.button_link ? (
              <Link
                href={cta.button_link}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5FE074] to-[#4fd064] hover:from-[#4fd064] hover:to-[#45c055] text-[#031C30] font-bold text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#5FE074]/50 hover:scale-105 transform overflow-hidden"
              >
                {/* Efeito de brilho no botão */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative z-10">{cta.button_text || "Associe-se"}</span>
                <svg
                  className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            ) : (
              <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5FE074] to-[#4fd064] text-[#031C30] font-bold text-base rounded-lg shadow-md opacity-75 cursor-not-allowed">
                {cta.button_text || "Associe-se"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

