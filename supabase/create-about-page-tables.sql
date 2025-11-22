-- Adiciona campo banner_image na tabela about_page
ALTER TABLE about_page
ADD COLUMN IF NOT EXISTS banner_image TEXT;

-- Tabela de membros da equipe
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  linkedin TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de diretoria
CREATE TABLE IF NOT EXISTS board_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  linkedin TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members("order");
CREATE INDEX IF NOT EXISTS idx_board_members_order ON board_members("order");

-- RLS Policies
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Team members are viewable by everyone" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Board members are viewable by everyone" ON board_members
  FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admins can insert team members" ON team_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update team members" ON team_members
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete team members" ON team_members
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert board members" ON board_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update board members" ON board_members
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete board members" ON board_members
  FOR DELETE USING (auth.uid() IS NOT NULL);

