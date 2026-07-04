-- Campos extras para espelhar o painel "Detalhes do imóvel" do site antigo
-- Execute este SQL no Supabase Dashboard → SQL Editor

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS suites INTEGER,
  ADD COLUMN IF NOT EXISTS parking_spots INTEGER,
  ADD COLUMN IF NOT EXISTS land_area NUMERIC,
  ADD COLUMN IF NOT EXISTS built_area NUMERIC;
