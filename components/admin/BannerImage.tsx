"use client";

import React from "react";

interface BannerImageProps {
  src: string;
  alt: string;
}

function BannerImage({ src, alt }: BannerImageProps) {
  return (
    <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Erro ao carregar imagem:", src);
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-full flex items-center justify-center bg-gray-200">
                <div class="text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-xs">Imagem não carregou</p>
                  <p class="text-xs text-gray-400 mt-1">Verifique as políticas de storage</p>
                </div>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}

export default BannerImage;

