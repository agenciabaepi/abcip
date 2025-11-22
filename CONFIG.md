# ⚙️ Configuração Rápida

## Arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

## Como obter as credenciais

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (mantenha secreto!)

## Após configurar

1. Execute o schema SQL (`supabase/schema.sql`) no SQL Editor do Supabase
2. Configure o bucket de storage `uploads`
3. Crie um usuário admin em Authentication > Users
4. Reinicie o servidor: `npm run dev`

## Status atual

✅ O servidor está rodando em modo de desenvolvimento
⚠️ Configure o `.env.local` para habilitar todas as funcionalidades

