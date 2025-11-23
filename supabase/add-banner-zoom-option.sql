-- Adiciona campo enable_zoom na tabela banners
ALTER TABLE banners
ADD COLUMN IF NOT EXISTS enable_zoom BOOLEAN DEFAULT true;

-- Atualiza banners existentes para ter zoom habilitado por padrão
UPDATE banners
SET enable_zoom = true
WHERE enable_zoom IS NULL;

