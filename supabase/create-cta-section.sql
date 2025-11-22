-- Criar tabela para seção CTA (Call to Action) da homepage
CREATE TABLE IF NOT EXISTS cta_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL DEFAULT 'Associe-se',
  button_link TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_cta_section_active ON cta_section(active);

-- Habilitar RLS
ALTER TABLE cta_section ENABLE ROW LEVEL SECURITY;

-- Política RLS: Qualquer um pode ler se estiver ativo
CREATE POLICY "Anyone can view active CTA section"
  ON cta_section
  FOR SELECT
  USING (active = true);

-- Política RLS: Apenas usuários autenticados podem inserir/atualizar/deletar
CREATE POLICY "Authenticated users can manage CTA section"
  ON cta_section
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_cta_section_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cta_section_updated_at
  BEFORE UPDATE ON cta_section
  FOR EACH ROW
  EXECUTE FUNCTION update_cta_section_updated_at();

-- Inserir registro padrão (inativo inicialmente)
INSERT INTO cta_section (title, description, button_text, button_link, active)
VALUES (
  'Faça Parte',
  'Seja associado ABCIP. Juntos, vamos conectar empresas e iluminar o futuro.',
  'Associe-se',
  '/contato',
  false
)
ON CONFLICT DO NOTHING;

