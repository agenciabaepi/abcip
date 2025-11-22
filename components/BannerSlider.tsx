"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/lib/types";

interface BannerSliderProps {
  banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] min-h-[300px] bg-gradient-to-r from-dark-900 to-dark-800 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 tracking-tight">
            ABCIP
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200">
            Concessionária de Iluminação Pública
          </p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  useEffect(() => {
    // Injeta o CSS da animação de zoom
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bannerZoom {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.15);
        }
      }
      .banner-zoom-active {
        animation: bannerZoom 20s ease-in-out infinite alternate;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] min-h-[300px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Imagem com efeito de zoom suave */}
          <div 
            className={`absolute inset-0 ${
              index === currentIndex ? "banner-zoom-active" : ""
            }`}
          >
            <Image
              src={banner.image_url}
              alt={banner.title || "Banner"}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
          
          {/* Overlay gradiente escuro */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
          
          {/* Conteúdo no canto inferior esquerdo */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="max-w-4xl">
              {banner.title && (
                <div className="relative inline-block">
                  {/* Shape decorativo embaixo do título */}
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-[#5FE074] rounded-sm transform -skew-x-12" />
                  <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight drop-shadow-lg">
                    {banner.title}
                  </h1>
                </div>
              )}
              {banner.subtitle && (
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mt-4 sm:mt-6 max-w-2xl drop-shadow-md">
                  {banner.subtitle}
                </p>
              )}
              {banner.link && (
                <a
                  href={banner.link}
                  className="inline-block mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base bg-[#5FE074] text-[#031C30] rounded-lg hover:bg-[#4fd064] transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Saiba Mais
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full transition shadow-lg"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full transition shadow-lg"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

