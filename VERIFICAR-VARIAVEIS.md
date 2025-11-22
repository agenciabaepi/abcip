# ⚠️ ERRO: Invalid API key

## Problema Identificado

O erro "Invalid API key" indica que as variáveis de ambiente do Supabase **NÃO estão configuradas corretamente** na Vercel.

## Solução Imediata

### 1. Verificar Variáveis na Vercel

Execute este comando para ver as variáveis atuais:

```bash
vercel env ls
```

### 2. Adicionar/Atualizar Variáveis

**Opção A: Via Dashboard Vercel (Recomendado)**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `abcip`
3. Vá em **Settings** → **Environment Variables**
4. Adicione/Edite estas variáveis:

   **Variável 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://bjnrzexclawzyotdtdfa.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variável 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnJ6ZXhjbGF3enlvdGR0ZGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDczNTMsImV4cCI6MjA3OTMyMzM1M30.rWkwul8iEeacGbfjX8XLiX_oHJO2NyAf9TNhzMjjCZw`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

5. **IMPORTANTE:** Após adicionar/editar, faça um **Redeploy**:
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**

**Opção B: Via CLI**

```bash
# Adicionar URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
# Cole: https://bjnrzexclawzyotdtdfa.supabase.co

# Adicionar ANON KEY
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnJ6ZXhjbGF3enlvdGR0ZGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDczNTMsImV4cCI6MjA3OTMyMzM1M30.rWkwul8iEeacGbfjX8XLiX_oHJO2NyAf9TNhzMjjCZw

# Fazer redeploy
vercel --prod --force
```

### 3. Verificar se Funcionou

Após o redeploy:
1. Acesse o site na Vercel
2. Tente fazer login
3. O erro "Invalid API key" deve desaparecer

## Por que isso acontece?

As variáveis de ambiente `NEXT_PUBLIC_*` precisam estar configuradas na Vercel para que o código do cliente (browser) possa acessá-las. Sem essas variáveis, o Supabase não consegue se conectar ao banco de dados.

## Nota Importante

⚠️ **SEMPRE faça um redeploy após adicionar/editar variáveis de ambiente na Vercel!**

As variáveis só são aplicadas em novos deployments.

