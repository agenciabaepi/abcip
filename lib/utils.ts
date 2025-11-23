import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extrai o ID do YouTube de uma URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Obtém a URL da thumbnail do YouTube
 */
export function getYouTubeThumbnail(url: string): string {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return "";
}

/**
 * Obtém a URL de embed do YouTube
 */
export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

/**
 * Calcula o tempo de leitura estimado de um texto
 * Baseado em ~200 palavras por minuto
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  
  // Remove tags HTML e espaços extras
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  // Conta palavras (divide por espaços)
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  
  // Calcula minutos (200 palavras por minuto)
  const minutes = Math.ceil(wordCount / 200);
  
  // Retorna pelo menos 1 minuto
  return Math.max(1, minutes);
}
