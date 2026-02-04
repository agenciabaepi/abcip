"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SiteViewTracker() {
  const pathname = usePathname();
  const sent = useRef(false);

  useEffect(() => {
    if (!pathname) return;
    // Não registrar visualizações no painel admin
    if (pathname.startsWith("/admin")) return;
    // Evitar duplicar no mesmo mount (Strict Mode pode duplicar)
    if (sent.current) return;
    sent.current = true;

    fetch("/api/site-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
