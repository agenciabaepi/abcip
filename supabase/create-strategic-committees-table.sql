-- Tabela de Comitês Estratégicos
CREATE TABLE IF NOT EXISTS strategic_committees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  leader_name TEXT,
  leader_email TEXT,
  description TEXT,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_strategic_committees_order ON strategic_committees("order");
CREATE INDEX IF NOT EXISTS idx_strategic_committees_active ON strategic_committees(active);

-- RLS Policies
ALTER TABLE strategic_committees ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Strategic committees are viewable by everyone" ON strategic_committees
  FOR SELECT USING (active = true);

-- Admin policies
CREATE POLICY "Admins can insert strategic committees" ON strategic_committees
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update strategic committees" ON strategic_committees
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete strategic committees" ON strategic_committees
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Allow admins to view all (including inactive)
CREATE POLICY "Admins can view all strategic committees" ON strategic_committees
  FOR SELECT USING (auth.uid() IS NOT NULL OR active = true);

