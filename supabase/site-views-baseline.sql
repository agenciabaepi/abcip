-- Baseline (média/histórico) de visualizações para somar aos números reais
-- Execute no SQL Editor do Supabase Dashboard

CREATE TABLE IF NOT EXISTS site_views_baseline (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total INTEGER NOT NULL DEFAULT 0,
  month_count INTEGER NOT NULL DEFAULT 0,
  day_count INTEGER NOT NULL DEFAULT 0
);

-- Garante que existe só uma linha
INSERT INTO site_views_baseline (id, total, month_count, day_count)
VALUES (1, 2539, 157, 39)
ON CONFLICT (id) DO UPDATE SET
  total = EXCLUDED.total,
  month_count = EXCLUDED.month_count,
  day_count = EXCLUDED.day_count;

-- RLS: só admin pode ler/atualizar
ALTER TABLE site_views_baseline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read baseline" ON site_views_baseline
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update baseline" ON site_views_baseline
  FOR UPDATE USING (auth.uid() IS NOT NULL);
