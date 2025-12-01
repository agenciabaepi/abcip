-- ========================================
-- SETUP PARA CTA DA PÁGINA DE ASSOCIADOS
-- ========================================

-- 1. Adicionar campos de CTA na tabela de configurações de associados
ALTER TABLE associados_page_settings
ADD COLUMN IF NOT EXISTS cta_title TEXT,
ADD COLUMN IF NOT EXISTS cta_description TEXT,
ADD COLUMN IF NOT EXISTS cta_button_text TEXT DEFAULT 'Faça Parte',
ADD COLUMN IF NOT EXISTS cta_button_link TEXT,
ADD COLUMN IF NOT EXISTS cta_image_url TEXT,
ADD COLUMN IF NOT EXISTS cta_active BOOLEAN DEFAULT false;

