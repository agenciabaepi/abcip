-- ========================================
-- CRIAR BUCKETS DE STORAGE
-- ========================================

-- 1. Criar bucket para imagens do site (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  15728640, -- 15MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar bucket para arquivos (PDFs, DOCs, etc)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-files',
  'site-files',
  true,
  15728640, -- 15MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- POLÍTICAS DE ACESSO - site-images
-- ========================================

-- Permitir leitura pública de imagens
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Permitir upload para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-images' 
  AND auth.role() = 'authenticated'
);

-- Permitir update para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-images' 
  AND auth.role() = 'authenticated'
);

-- Permitir delete para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-images' 
  AND auth.role() = 'authenticated'
);

-- ========================================
-- POLÍTICAS DE ACESSO - site-files
-- ========================================

-- Permitir leitura pública de arquivos
DROP POLICY IF EXISTS "Public Access Files" ON storage.objects;
CREATE POLICY "Public Access Files"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-files');

-- Permitir upload para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-files' 
  AND auth.role() = 'authenticated'
);

-- Permitir update para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-files' 
  AND auth.role() = 'authenticated'
);

-- Permitir delete para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-files' 
  AND auth.role() = 'authenticated'
);

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Listar buckets criados
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('site-images', 'site-files');

