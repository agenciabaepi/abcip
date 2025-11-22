-- Script SIMPLIFICADO para configurar políticas de storage
-- Execute este script no SQL Editor do Supabase Dashboard

-- Remove todas as políticas antigas
DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete uploads" ON storage.objects;

-- Política 1: QUALQUER UM pode ler (público)
CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Política 2: Apenas autenticados podem fazer upload
CREATE POLICY "Authenticated insert uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

-- Política 3: Apenas autenticados podem atualizar
CREATE POLICY "Authenticated update uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

-- Política 4: Apenas autenticados podem deletar
CREATE POLICY "Authenticated delete uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

