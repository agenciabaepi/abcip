-- Adicionar campo de ordem na tabela associates
ALTER TABLE associates
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_associates_order ON associates("order");

-- Atualizar ordem existente baseada na data de criação
UPDATE associates
SET "order" = subquery.row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number
  FROM associates
) AS subquery
WHERE associates.id = subquery.id;

