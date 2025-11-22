/**
 * Calcula o tempo estimado de leitura baseado no conteúdo HTML
 * Assumindo uma velocidade média de 200 palavras por minuto
 */
export function calculateReadingTime(htmlContent: string): number {
  // Remove tags HTML e espaços extras
  const textContent = htmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Conta palavras (separadas por espaços)
  const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
  
  // Velocidade média: 200 palavras por minuto
  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Mínimo de 1 minuto
  return Math.max(1, readingTime);
}

