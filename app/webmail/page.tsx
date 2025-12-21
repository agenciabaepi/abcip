"use client";

import { useEffect } from "react";

export default function WebmailRedirect() {
  useEffect(() => {
    // Redireciona para o webmail da KingHost
    window.location.href = "https://webmail.kinghost.com.br/abcip.com.br";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para o webmail...</p>
      </div>
    </div>
  );
}

