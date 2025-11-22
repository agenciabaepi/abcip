"use client";

import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Pega as variáveis de ambiente - elas devem estar disponíveis no cliente
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Debug: log das variáveis (sem expor valores completos)
  if (typeof window !== "undefined") {
    console.log("[Supabase Client] Environment check:", {
      hasUrl: !!url,
      hasKey: !!key,
      urlLength: url?.length || 0,
      keyLength: key?.length || 0,
      urlStart: url ? url.substring(0, 20) : "missing",
      keyStart: key ? key.substring(0, 20) : "missing",
    });
  }

  // Validação rigorosa das variáveis
  if (!url || !key) {
    const errorMsg = "❌ Variáveis de ambiente do Supabase não encontradas. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel e faça um redeploy.";
    console.error(errorMsg, { 
      hasUrl: !!url, 
      hasKey: !!key,
      allEnvKeys: typeof window !== "undefined" ? Object.keys(process.env).filter(k => k.startsWith("NEXT_PUBLIC_")) : []
    });
    throw new Error(errorMsg);
  }

  // Valida se a URL e a key não são valores padrão/placeholder
  if (url.includes("seu-projeto") || url.includes("your-project") || url.includes("placeholder") ||
      key.includes("your-anon-key") || key.includes("placeholder") || key.length < 50) {
    const errorMsg = "Supabase environment variables are not properly configured. Please set the correct values in Vercel settings.";
    console.error(errorMsg, { url, keyLength: key?.length });
    throw new Error(errorMsg);
  }

  // Valida formato da URL
  if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
    const errorMsg = `Invalid Supabase URL format: ${url}. Expected format: https://[project].supabase.co`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Cria uma instância única do cliente para manter a sessão
  if (!supabaseClient) {
    try {
      console.log("Creating Supabase client with URL:", url.substring(0, 30) + "...");
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
      
      console.log("Supabase client created successfully", { url: url.substring(0, 30) + "..." });
    } catch (error) {
      console.error("Error creating Supabase client:", error);
      throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return supabaseClient;
}

