"use client";

import Link from "next/link";
import Image from "next/image";

interface AssociadosCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  imageUrl?: string;
}

export default function AssociadosCTA({
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl,
}: AssociadosCTAProps) {
  return (
    <section className="relative overflow-hidden w-full h-[300px]">
      {/* Imagem de fundo */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Conteúdo sobreposto */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="w-full lg:w-1/2">
          <div className="space-y-4">
            <p className="font-archivo text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed whitespace-pre-line">
              {description}
            </p>
            
            <div className="pt-2">
              {buttonLink ? (
                <Link
                  href={buttonLink}
                  className="inline-flex items-center justify-center px-10 py-4 font-semibold text-lg text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                  style={{ backgroundColor: '#5FE074' }}
                >
                  <span>{buttonText}</span>
                </Link>
              ) : (
                <div 
                  className="inline-flex items-center justify-center px-10 py-4 font-semibold text-lg text-white rounded-full shadow-md opacity-75 cursor-not-allowed"
                  style={{ backgroundColor: '#5FE074' }}
                >
                  {buttonText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

