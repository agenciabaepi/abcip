-- Garante que footer_settings tem todas as colunas usadas pela página de configurações.
-- Execute no SQL Editor do Supabase se aparecer erro de coluna não encontrada.

ALTER TABLE footer_settings
ADD COLUMN IF NOT EXISTS youtube TEXT;

ALTER TABLE footer_settings
ADD COLUMN IF NOT EXISTS background_image_url TEXT;
