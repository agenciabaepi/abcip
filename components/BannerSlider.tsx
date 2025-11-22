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

  return (
    <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] min-h-[300px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner.image_url}
            alt={banner.title || "Banner"}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 max-w-3xl">
              {banner.title && (
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 tracking-tight">
                  {banner.title}
                </h1>
              )}
              {banner.subtitle && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl lg:text-2xl text-gray-200">
                  {banner.subtitle}
                </p>
              )}
              {banner.link && (
                <a
                  href={banner.link}
                  className="inline-block mt-4 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-primary-500 text-dark-900 rounded-lg hover:bg-primary-400 transition font-semibold"
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

