"use client";

import { useState } from "react";

interface AssociateLogoProps {
  logoUrl: string;
  name: string;
  className?: string;
}

export default function AssociateLogo({
  logoUrl,
  name,
  className = "max-w-full max-h-full object-contain",
}: AssociateLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !logoUrl) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-xs">Sem logo</span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={name}
      className={className}
      onError={() => {
        console.error("Erro ao carregar imagem:", logoUrl);
        setHasError(true);
      }}
    />
  );
}

