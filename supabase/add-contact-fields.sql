-- Adicionar campos company_name e subject na tabela contact_messages
ALTER TABLE contact_messages
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS subject TEXT;

