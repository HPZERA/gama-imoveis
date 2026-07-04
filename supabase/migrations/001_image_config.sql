-- Tabela de configurações de imagem do painel admin
-- Execute este SQL no Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS image_config (
  id                        TEXT PRIMARY KEY,
  max_width                 INTEGER NOT NULL DEFAULT 1920,
  quality                   INTEGER NOT NULL DEFAULT 85,
  format                    TEXT    NOT NULL DEFAULT 'webp',
  webp_enabled              BOOLEAN NOT NULL DEFAULT true,
  max_file_size_mb          INTEGER NOT NULL DEFAULT 10,
  max_images_per_property   INTEGER NOT NULL DEFAULT 20,
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- Insere a linha de configuração padrão
INSERT INTO image_config (id, max_width, quality, format, webp_enabled, max_file_size_mb, max_images_per_property)
VALUES ('default', 1920, 85, 'webp', true, 10, 20)
ON CONFLICT (id) DO NOTHING;
