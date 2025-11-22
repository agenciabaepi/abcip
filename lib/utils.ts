/**
 * Extrai o ID do vídeo do YouTube a partir de uma URL
 * Suporta vários formatos:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
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
 * Gera a URL da thumbnail do YouTube
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualities = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}.jpg`;
}

/**
 * Gera a URL de embed do YouTube
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Calcula o tempo estimado de leitura de um texto
 */
export function calculateReadingTime(text: string): number {
  if (!text) return 0;
  
  // Remove HTML tags se houver
  const plainText = text.replace(/<[^>]*>/g, '');
  
  // Média de palavras por minuto: 200-250 palavras
  const wordsPerMinute = 225;
  const wordCount = plainText.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return readingTime || 1; // Mínimo de 1 minuto
}
