-- Adiciona campo author na tabela posts
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS author TEXT;

