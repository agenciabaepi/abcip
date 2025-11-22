-- Adiciona campos extras para posts (notícias)
-- Execute este script no SQL Editor do Supabase Dashboard

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS external_link TEXT,
ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP WITH TIME ZONE;

-- Atualiza publish_date para created_at se não existir
UPDATE posts
SET publish_date = created_at
WHERE publish_date IS NULL;

