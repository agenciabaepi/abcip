-- Tabela de visualizações reais do site (page views)
-- Execute no SQL Editor do Supabase Dashboard

CREATE TABLE IF NOT EXISTS site_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas por período (total, mensal, diário)
CREATE INDEX IF NOT EXISTS idx_site_views_viewed_at ON site_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_views_path ON site_views(path);

-- RLS
ALTER TABLE site_views ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode inserir (API pública registra visualizações)
CREATE POLICY "Anyone can insert site views" ON site_views
  FOR INSERT WITH CHECK (true);

-- Apenas usuários autenticados (admin) podem ler
CREATE POLICY "Authenticated can read site views" ON site_views
  FOR SELECT USING (auth.uid() IS NOT NULL);
