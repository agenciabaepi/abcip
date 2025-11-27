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
-- POLÍTICAS DE ACESSO - storage.objects
-- ========================================

-- Remover todas as políticas antigas
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Criar políticas simples e funcionais
-- Leitura pública para todos os buckets do site
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('site-images', 'site-files'));

-- Upload para usuários autenticados
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('site-images', 'site-files')
  AND auth.role() = 'authenticated'
);

-- Update para usuários autenticados
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('site-images', 'site-files')
  AND auth.role() = 'authenticated'
);

-- Delete para usuários autenticados
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('site-images', 'site-files')
  AND auth.role() = 'authenticated'
);

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Listar buckets criados
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('site-images', 'site-files');

