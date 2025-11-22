-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table (notícias)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  link TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Associates table
CREATE TABLE IF NOT EXISTS associates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About page table
CREATE TABLE IF NOT EXISTS about_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Quem Somos',
  content TEXT NOT NULL,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer settings table
CREATE TABLE IF NOT EXISTS footer_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT,
  phone TEXT,
  email TEXT,
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,
  twitter TEXT,
  links TEXT, -- JSON string
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'ABCIP',
  site_description TEXT,
  contact_email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts USING gin(to_tsvector('portuguese', title || ' ' || COALESCE(excerpt, '') || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners("order");
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

-- Insert default site settings
INSERT INTO site_settings (id, site_name, site_description) 
VALUES ('00000000-0000-0000-0000-000000000001', 'ABCIP', 'Concessionária de Iluminação Pública')
ON CONFLICT (id) DO NOTHING;

-- Insert default about page
INSERT INTO about_page (id, title, content) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Quem Somos', 'Conteúdo sobre a ABCIP...')
ON CONFLICT (id) DO NOTHING;

-- Insert default footer settings
INSERT INTO footer_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- RLS Policies (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public posts are viewable by everyone" ON posts
  FOR SELECT USING (published = true);

-- Public read access for banners
CREATE POLICY "Banners are viewable by everyone" ON banners
  FOR SELECT USING (true);

-- Public read access for associates
CREATE POLICY "Associates are viewable by everyone" ON associates
  FOR SELECT USING (true);

-- Public read access for about page
CREATE POLICY "About page is viewable by everyone" ON about_page
  FOR SELECT USING (true);

-- Public read access for footer settings
CREATE POLICY "Footer settings are viewable by everyone" ON footer_settings
  FOR SELECT USING (true);

-- Public read access for site settings
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

-- Public insert access for contact messages
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Admin policies - Allow authenticated users to manage content
-- Note: In production, you may want to add role-based access control

-- Posts admin policies
CREATE POLICY "Admins can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update posts" ON posts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete posts" ON posts
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all posts" ON posts
  FOR SELECT USING (auth.uid() IS NOT NULL OR published = true);

-- Banners admin policies
CREATE POLICY "Admins can insert banners" ON banners
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update banners" ON banners
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete banners" ON banners
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Associates admin policies
CREATE POLICY "Admins can insert associates" ON associates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update associates" ON associates
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete associates" ON associates
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- About page admin policies
CREATE POLICY "Admins can insert about page" ON about_page
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update about page" ON about_page
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete about page" ON about_page
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Footer settings admin policies
CREATE POLICY "Admins can insert footer settings" ON footer_settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update footer settings" ON footer_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete footer settings" ON footer_settings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Site settings admin policies
CREATE POLICY "Admins can insert site settings" ON site_settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update site settings" ON site_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete site settings" ON site_settings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Contact messages admin policies (read only for admins)
CREATE POLICY "Admins can view contact messages" ON contact_messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

