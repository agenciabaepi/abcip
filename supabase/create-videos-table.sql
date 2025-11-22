-- Criar tabela para vídeos do YouTube
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(active);
CREATE INDEX IF NOT EXISTS idx_videos_order ON videos(order_index);

-- Habilitar RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Política RLS: Qualquer um pode ler se estiver ativo
CREATE POLICY "Anyone can view active videos"
  ON videos
  FOR SELECT
  USING (active = true);

-- Política RLS: Apenas usuários autenticados podem inserir/atualizar/deletar
CREATE POLICY "Authenticated users can manage videos"
  ON videos
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_videos_updated_at();

