"use client";

import Link from "next/link";
import Image from "next/image";
import { CTASection as CTASectionType } from "@/lib/types";
import ABCIPText from "@/components/ABCIPText";

interface CTASectionProps {
  cta: CTASectionType;
}

function SingleCTA({ cta, isLeft = false }: { cta: CTASectionType; isLeft?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${isLeft ? 'bg-gray-100' : 'bg-dark-900'} py-16 md:py-20 lg:py-24`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Imagem - Sempre à esquerda */}
          {cta.image_url && (
            <div className="relative order-1">
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={cta.image_url}
                  alt={cta.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Conteúdo - Sempre à direita */}
          <div className={`relative z-10 order-2 ${!cta.image_url ? 'lg:col-span-2' : ''}`}>
            <div className="space-y-6">
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${isLeft ? 'text-gray-900' : 'text-white'}`}>
                {isLeft ? (
                  cta.title
                ) : (
                  <ABCIPText>{cta.title}</ABCIPText>
                )}
              </h2>
              
              <p className={`text-lg md:text-xl leading-relaxed ${isLeft ? 'text-gray-700' : 'text-gray-200'}`}>
                {isLeft ? (
                  cta.description
                ) : (
                  <ABCIPText>{cta.description}</ABCIPText>
                )}
              </p>

              <div className="pt-2">
                {cta.button_link ? (
                  <Link
                    href={cta.button_link}
                    className={`group inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform ${
                      isLeft 
                        ? `text-white` 
                        : 'text-dark-900'
                    }`}
                    style={{
                      backgroundColor: isLeft ? (cta.button_color || '#3b82f6') : '#5FE074'
                    }}
                  >
                    <span>{cta.button_text}</span>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
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
                  <div 
                    className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-lg shadow-md opacity-75 cursor-not-allowed ${
                      isLeft ? 'text-white' : 'text-dark-900'
                    }`}
                    style={{
                      backgroundColor: isLeft ? (cta.button_color || '#3b82f6') : '#5FE074'
                    }}
                  >
                    {cta.button_text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CTASection({ cta }: CTASectionProps) {
  if (!cta || !cta.active) {
    return null;
  }

  // Se usar dual CTA, renderiza 2 CTAs lado a lado
  if (cta.use_dual_cta && cta.cta2_title) {
    const cta1 = {
      ...cta,
      title: cta.title,
      description: cta.description,
      button_text: cta.button_text,
      button_link: cta.button_link,
      image_url: cta.image_url,
      button_color: cta.cta1_button_color || '#3b82f6', // Cor configurável para o primeiro CTA
    };

    const cta2 = {
      ...cta,
      title: cta.cta2_title,
      description: cta.cta2_description || '',
      button_text: cta.cta2_button_text || 'Associe-se',
      button_link: cta.cta2_button_link,
      image_url: cta.cta2_image_url,
    };

    return (
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <SingleCTA cta={cta1} isLeft={true} />
        <SingleCTA cta={cta2} isLeft={false} />
      </section>
    );
  }

  // CTA único (comportamento original)
  return (
    <section className="relative overflow-hidden py-8 md:py-10 lg:py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-[#031C30] via-[#052a45] to-[#031C30]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {cta.image_url && (
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[3/4] max-h-80 rounded-xl overflow-hidden shadow-2xl group">
                <Image
                  src={cta.image_url}
                  alt={cta.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}

          <div className={`order-1 lg:order-2 relative z-10 ${!cta.image_url ? 'lg:col-span-2 text-center' : ''}`}>
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
