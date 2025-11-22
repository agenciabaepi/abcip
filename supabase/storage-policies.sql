-- Script para configurar políticas RLS do Storage bucket "uploads"
-- Execute este script no SQL Editor do Supabase Dashboard

-- IMPORTANTE: Primeiro, certifique-se de que o bucket "uploads" existe e está público
-- Vá em Storage > Create bucket > Name: "uploads" > Public bucket: ✅

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete uploads" ON storage.objects;

-- Política 1: Leitura pública para o bucket "uploads"
CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Política 2: Upload (INSERT) apenas para usuários autenticados no bucket "uploads"
CREATE POLICY "Authenticated insert uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads' 
  AND auth.uid() IS NOT NULL
);

-- Política 3: Atualização (UPDATE) apenas para usuários autenticados no bucket "uploads"
CREATE POLICY "Authenticated update uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'uploads' 
  AND auth.uid() IS NOT NULL
);

-- Política 4: Exclusão (DELETE) apenas para usuários autenticados no bucket "uploads"
CREATE POLICY "Authenticated delete uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uploads' 
  AND auth.uid() IS NOT NULL
);

-- Verifica se as políticas foram criadas
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%uploads%';

