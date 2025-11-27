-- ========================================
-- SETUP COMPLETO PARA PUBLICAÇÕES
-- ========================================

-- 1. Criar tabela de configurações da página
CREATE TABLE IF NOT EXISTS publicacoes_page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banner_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de publicações
CREATE TABLE IF NOT EXISTS publicacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  file_url TEXT,
  file_name TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Inserir configuração inicial
INSERT INTO publicacoes_page_settings (banner_image_url)
VALUES ('/images/banner-publicacoes.jpg')
ON CONFLICT DO NOTHING;

-- 4. Habilitar Row Level Security
ALTER TABLE publicacoes_page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicacoes ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir leitura pública das configurações" ON publicacoes_page_settings;
DROP POLICY IF EXISTS "Permitir leitura pública das publicações" ON publicacoes;
DROP POLICY IF EXISTS "Permitir todas operações para usuários autenticados nas configurações" ON publicacoes_page_settings;
DROP POLICY IF EXISTS "Permitir todas operações para usuários autenticados nas publicações" ON publicacoes;

-- 6. Criar políticas de acesso público (leitura)
CREATE POLICY "Permitir leitura pública das configurações" 
  ON publicacoes_page_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir leitura pública das publicações" 
  ON publicacoes 
  FOR SELECT 
  USING (true);

-- 7. Criar políticas para usuários autenticados (todas operações)
CREATE POLICY "Permitir todas operações para usuários autenticados nas configurações" 
  ON publicacoes_page_settings 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todas operações para usuários autenticados nas publicações" 
  ON publicacoes 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Verificar se as tabelas foram criadas
SELECT 'publicacoes_page_settings' as tabela, COUNT(*) as registros FROM publicacoes_page_settings
UNION ALL
SELECT 'publicacoes' as tabela, COUNT(*) as registros FROM publicacoes;

