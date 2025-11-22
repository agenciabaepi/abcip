"use client";

import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
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

