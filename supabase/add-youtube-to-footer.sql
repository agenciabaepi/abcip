-- Adiciona campo YouTube nas configurações do rodapé
ALTER TABLE footer_settings
ADD COLUMN IF NOT EXISTS youtube TEXT;

