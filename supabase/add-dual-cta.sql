-- Adiciona campos para segundo CTA na tabela cta_section
ALTER TABLE cta_section
ADD COLUMN IF NOT EXISTS cta1_button_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS cta2_title TEXT,
ADD COLUMN IF NOT EXISTS cta2_description TEXT,
ADD COLUMN IF NOT EXISTS cta2_button_text TEXT DEFAULT 'Conheça',
ADD COLUMN IF NOT EXISTS cta2_button_link TEXT,
ADD COLUMN IF NOT EXISTS cta2_image_url TEXT,
ADD COLUMN IF NOT EXISTS cta2_background_color TEXT DEFAULT '#f3f4f6',
ADD COLUMN IF NOT EXISTS cta2_text_color TEXT DEFAULT '#1f2937',
ADD COLUMN IF NOT EXISTS cta2_button_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS use_dual_cta BOOLEAN DEFAULT false;

-- Atualiza registros existentes
UPDATE cta_section
SET use_dual_cta = false,
    cta1_button_color = COALESCE(cta2_button_color, '#3b82f6')
WHERE use_dual_cta IS NULL;

