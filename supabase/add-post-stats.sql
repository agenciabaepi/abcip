-- Adiciona campos de estatísticas para posts (notícias)
-- Execute este script no SQL Editor do Supabase Dashboard

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0;

-- Cria índice para melhor performance em consultas ordenadas por views/likes
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes ON posts(likes DESC);

