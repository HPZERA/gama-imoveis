-- Auditoria de segurança 2026-07-07: nenhuma destas tabelas tinha RLS
-- habilitado. Isso significa que a anon key (pública, embutida no bundle
-- do site) conseguia ler/gravar diretamente via API REST do Supabase,
-- sem passar pelo Next.js — confirmado em teste: um lead de teste inserido
-- via anon key podia ser lido de volta pela própria anon key.
--
-- Toda a leitura/escrita destas tabelas agora acontece exclusivamente no
-- servidor (Next.js), usando a service role key, que sempre ignora RLS.
-- Por isso a política correta aqui é "RLS ligado, zero policies" — nega
-- tudo para as chaves anon/authenticated, sem afetar o service role.
--
-- Execute este SQL no Supabase Dashboard → SQL Editor

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_config ENABLE ROW LEVEL SECURITY;

-- Nenhuma policy é criada de propósito: com RLS ligado e sem policies,
-- anon/authenticated não conseguem SELECT/INSERT/UPDATE/DELETE em nenhuma
-- das três tabelas. Apenas a service role (usada só no servidor) continua
-- com acesso total.
