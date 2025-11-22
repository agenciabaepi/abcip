-- Adiciona campo logo_url na tabela site_settings
-- Execute este script no SQL Editor do Supabase Dashboard

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS logo_url TEXT;

