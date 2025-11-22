-- Script para VERIFICAR o status do bucket e políticas
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verifica se o bucket existe e está público
SELECT 
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'uploads';

-- 2. Verifica as políticas existentes
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%uploads%';

-- 3. Se o bucket não existir ou não estiver público, você verá isso aqui
-- Vá em Storage > Create bucket > Name: "uploads" > Public bucket: ✅

