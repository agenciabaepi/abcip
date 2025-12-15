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

/**
 * Converte URLs em links clicáveis HTML
 */
export function convertUrlsToLinks(html: string): string {
  if (!html) return "";
  
  // Regex para detectar URLs que não estão dentro de tags HTML
  const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)|(www\.[^\s<>"{}|\\^`\[\]]+)/gi;
  
  let result = html;
  const replacements: Array<{ start: number; end: number; replacement: string }> = [];
  
  // Encontrar todas as URLs e preparar substituições
  let match;
  while ((match = urlPattern.exec(html)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    const matchText = match[0];
    
    // Verificar se está dentro de uma tag <a>
    const beforeMatch = html.substring(0, start);
    const lastOpenTag = beforeMatch.lastIndexOf('<');
    const lastCloseTag = beforeMatch.lastIndexOf('>');
    
    // Se está dentro de uma tag HTML, verificar se é <a>
    if (lastOpenTag > lastCloseTag) {
      const tagStart = beforeMatch.substring(lastOpenTag);
      if (tagStart.includes('<a') && !tagStart.includes('</a>')) {
        continue; // Já está dentro de um link, pular
      }
    }
    
    // Determinar a URL completa
    let url = matchText;
    if (matchText.toLowerCase().startsWith('www.')) {
      url = 'https://' + matchText;
    }
    
    // Remover pontuação final comum (.,;:!?)
    const punctuationMatch = matchText.match(/[.,;:!?]+$/);
    const punctuation = punctuationMatch ? punctuationMatch[0] : '';
    const cleanUrl = url.replace(/[.,;:!?]+$/, '');
    const cleanMatch = matchText.replace(/[.,;:!?]+$/, '');
    
    const replacement = `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:text-primary-600 underline">${cleanMatch}</a>${punctuation}`;
    
    replacements.push({ start, end, replacement });
  }
  
  // Aplicar substituições de trás para frente para não alterar índices
  for (let i = replacements.length - 1; i >= 0; i--) {
    const { start, end, replacement } = replacements[i];
    result = result.substring(0, start) + replacement + result.substring(end);
  }
  
  return result;
}
