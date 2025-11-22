-- Script COMPLETO para configurar o bucket e políticas
-- Execute este script no SQL Editor do Supabase Dashboard

-- IMPORTANTE: Este script assume que o bucket "uploads" já existe
-- Se não existir, crie manualmente em Storage > Create bucket:
-- Name: "uploads" | Public bucket: ✅

-- 1. Garante que o bucket está público (se já existir)
UPDATE storage.buckets
SET public = true
WHERE name = 'uploads';

-- 2. Remove TODAS as políticas antigas relacionadas a uploads
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%upload%') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- 3. Cria as políticas corretas
CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated insert uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

-- 4. Verifica se funcionou
SELECT 
  'Bucket status:' as info,
  name,
  public
FROM storage.buckets
WHERE name = 'uploads';

SELECT 
  'Políticas criadas:' as info,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%uploads%';

