-- ========================================
-- SETUP PARA COMENTÁRIOS EM NOTÍCIAS
-- ========================================

-- 1. Criar tabela de comentários
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_approved ON post_comments(approved);

-- 3. Habilitar Row Level Security
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir leitura pública de comentários aprovados" ON post_comments;
DROP POLICY IF EXISTS "Permitir criação de comentários públicos" ON post_comments;
DROP POLICY IF EXISTS "Permitir todas operações para usuários autenticados em comentários" ON post_comments;

-- 5. Criar política de acesso público (leitura apenas de comentários aprovados)
CREATE POLICY "Permitir leitura pública de comentários aprovados" 
  ON post_comments 
  FOR SELECT 
  USING (approved = true);

-- 6. Criar política para criação de comentários (qualquer um pode criar)
CREATE POLICY "Permitir criação de comentários públicos" 
  ON post_comments 
  FOR INSERT 
  WITH CHECK (true);

-- 7. Criar política para usuários autenticados (todas operações)
CREATE POLICY "Permitir todas operações para usuários autenticados em comentários" 
  ON post_comments 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- 8. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_post_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_updated_at();

