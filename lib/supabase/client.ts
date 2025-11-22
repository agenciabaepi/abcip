"use client";

import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const errorMsg = "Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel settings.";
    console.error(errorMsg, { url: !!url, key: !!key });
    throw new Error(errorMsg);
  }

  // Valida se a URL e a key não são valores padrão/placeholder
  if (url.includes("seu-projeto") || url.includes("your-project") || key.includes("your-anon-key")) {
    const errorMsg = "Supabase environment variables are not properly configured. Please set the correct values in Vercel settings.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Cria uma instância única do cliente para manter a sessão
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(url, key, {
      cookies: {
        getAll() {
          // Retorna array vazio se não estiver no browser (durante SSR)
          if (typeof document === "undefined") {
            return [];
          }
          return document.cookie.split("; ").map((cookie) => {
            const [name, ...rest] = cookie.split("=");
            return { name, value: decodeURIComponent(rest.join("=")) };
          });
        },
        setAll(cookiesToSet) {
          // Não faz nada se não estiver no browser (durante SSR)
          if (typeof document === "undefined") {
            return;
          }
          cookiesToSet.forEach(({ name, value, options }) => {
            document.cookie = `${name}=${encodeURIComponent(value)}; path=${options?.path ?? "/"}; ${
              options?.maxAge ? `max-age=${options.maxAge};` : ""
            } ${options?.domain ? `domain=${options.domain};` : ""} ${
              options?.sameSite ? `samesite=${options.sameSite};` : "samesite=lax;"
            } ${options?.secure ? "secure;" : ""}`;
          });
        },
      },
    });
  }

  return supabaseClient;
}

