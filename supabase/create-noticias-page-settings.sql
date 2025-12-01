-- ========================================
-- SETUP PARA PÁGINA DE NOTÍCIAS
-- ========================================

-- 1. Criar tabela de configurações da página de notícias
CREATE TABLE IF NOT EXISTS noticias_page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banner_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inserir configuração inicial
INSERT INTO noticias_page_settings (banner_image_url)
VALUES (NULL)
ON CONFLICT DO NOTHING;

-- 3. Habilitar Row Level Security
ALTER TABLE noticias_page_settings ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir leitura pública das configurações de notícias" ON noticias_page_settings;
DROP POLICY IF EXISTS "Permitir todas operações para usuários autenticados nas configurações de notícias" ON noticias_page_settings;

-- 5. Criar política de acesso público (leitura)
CREATE POLICY "Permitir leitura pública das configurações de notícias" 
  ON noticias_page_settings 
  FOR SELECT 
  USING (true);

-- 6. Criar política para usuários autenticados (todas operações)
CREATE POLICY "Permitir todas operações para usuários autenticados nas configurações de notícias" 
  ON noticias_page_settings 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

