-- Adiciona campo para imagem de fundo do rodapé
ALTER TABLE footer_settings
ADD COLUMN IF NOT EXISTS background_image_url TEXT;

