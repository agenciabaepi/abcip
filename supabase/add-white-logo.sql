-- Adicionar coluna para logo branco nas configurações do site
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS logo_white_url TEXT;

