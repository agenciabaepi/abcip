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
  className,
}: AssociateLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !logoUrl) {
    return (
      <div className="w-full h-full min-h-[60px] bg-gray-200 flex items-center justify-center rounded">
        <span className="text-gray-400 text-xs">Sem logo</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center">
      <img
        src={logoUrl}
        alt={name}
        className={className ?? "max-w-full max-h-full w-auto h-auto object-contain"}
        style={{ maxHeight: "100%", maxWidth: "100%", width: "auto", height: "auto" }}
        onError={() => {
          console.error("Erro ao carregar imagem:", logoUrl);
          setHasError(true);
        }}
      />
    </div>
  );
}

