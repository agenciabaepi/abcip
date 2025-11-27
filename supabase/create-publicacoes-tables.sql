-- Criar tabela para configurações da página de publicações
CREATE TABLE IF NOT EXISTS publicacoes_page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banner_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para publicações
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

-- Inserir configuração inicial se não existir
INSERT INTO publicacoes_page_settings (id, banner_image_url)
SELECT uuid_generate_v4(), '/images/banner-publicacoes.jpg'
WHERE NOT EXISTS (SELECT 1 FROM publicacoes_page_settings);

-- Habilitar RLS
ALTER TABLE publicacoes_page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicacoes ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura
CREATE POLICY "Permitir leitura pública das configurações" ON publicacoes_page_settings
  FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública das publicações" ON publicacoes
  FOR SELECT USING (true);

-- Políticas de admin (ajustar conforme necessário)
CREATE POLICY "Permitir todas operações para usuários autenticados nas configurações" ON publicacoes_page_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todas operações para usuários autenticados nas publicações" ON publicacoes
  FOR ALL USING (auth.role() = 'authenticated');

