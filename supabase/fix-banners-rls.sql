-- Script específico para corrigir políticas RLS de banners
-- Execute este script no SQL Editor do Supabase Dashboard

-- Remove todas as políticas existentes de banners
DROP POLICY IF EXISTS "Admins can manage banners" ON banners;
DROP POLICY IF EXISTS "Admins can insert banners" ON banners;
DROP POLICY IF EXISTS "Admins can update banners" ON banners;
DROP POLICY IF EXISTS "Admins can delete banners" ON banners;
DROP POLICY IF EXISTS "Banners are viewable by everyone" ON banners;

-- Recria a política de leitura pública
CREATE POLICY "Banners are viewable by everyone" ON banners
  FOR SELECT USING (true);

-- Política de INSERT - IMPORTANTE: usa WITH CHECK
CREATE POLICY "Admins can insert banners" ON banners
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política de UPDATE - usa USING
CREATE POLICY "Admins can update banners" ON banners
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política de DELETE - usa USING
CREATE POLICY "Admins can delete banners" ON banners
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Verifica se RLS está habilitado
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Teste: Verifica se as políticas foram criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'banners';

