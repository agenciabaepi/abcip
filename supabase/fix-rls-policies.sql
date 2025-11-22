-- Script para corrigir as políticas RLS
-- Execute este script no SQL Editor do Supabase Dashboard

-- Remove políticas antigas que usam auth.role()
DROP POLICY IF EXISTS "Admins can manage banners" ON banners;
DROP POLICY IF EXISTS "Admins can insert posts" ON posts;
DROP POLICY IF EXISTS "Admins can update posts" ON posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
DROP POLICY IF EXISTS "Admins can manage associates" ON associates;
DROP POLICY IF EXISTS "Admins can manage about page" ON about_page;
DROP POLICY IF EXISTS "Admins can manage footer settings" ON footer_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;

-- Banners admin policies (corrigidas)
CREATE POLICY "Admins can insert banners" ON banners
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update banners" ON banners
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete banners" ON banners
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Posts admin policies (corrigidas)
CREATE POLICY "Admins can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update posts" ON posts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete posts" ON posts
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all posts" ON posts
  FOR SELECT USING (auth.uid() IS NOT NULL OR published = true);

-- Associates admin policies (corrigidas)
CREATE POLICY "Admins can insert associates" ON associates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update associates" ON associates
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete associates" ON associates
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- About page admin policies (corrigidas)
CREATE POLICY "Admins can insert about page" ON about_page
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update about page" ON about_page
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete about page" ON about_page
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Footer settings admin policies (corrigidas)
CREATE POLICY "Admins can insert footer settings" ON footer_settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update footer settings" ON footer_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete footer settings" ON footer_settings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Site settings admin policies (corrigidas)
CREATE POLICY "Admins can insert site settings" ON site_settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update site settings" ON site_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete site settings" ON site_settings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Contact messages admin policies (corrigidas)
CREATE POLICY "Admins can view contact messages" ON contact_messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

