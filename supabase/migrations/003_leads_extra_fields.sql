-- Campos extras para o formulário "Fale conosco" (popup de WhatsApp já usa só name/whatsapp)
-- Execute este SQL no Supabase Dashboard → SQL Editor

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS message TEXT;
