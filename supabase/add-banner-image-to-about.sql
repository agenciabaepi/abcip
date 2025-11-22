-- Adiciona campo banner_image na tabela about_page
ALTER TABLE about_page
ADD COLUMN IF NOT EXISTS banner_image TEXT;

