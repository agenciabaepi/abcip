# 🔴 CORREÇÃO URGENTE: Invalid API key

## Problema Identificado

O erro "Invalid API key" com código 401 significa que a **chave anon_key está incorreta ou foi regenerada** no Supabase.

## Solução

### 1. Obter a Chave Correta do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `bjnrzexclawzyotdtdfa`
3. Vá em **Settings** → **API**
4. Na seção **Project API keys**, copie a chave **anon public** (não a service_role!)

### 2. Atualizar na Vercel

**Opção A: Via Dashboard (Recomendado)**

1. Acesse: https://vercel.com/dashboard
2. Projeto `abcip` → **Settings** → **Environment Variables**
3. **DELETE** a variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` existente
4. **ADD** novamente:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: **[COLE A CHAVE ANON PUBLIC DO SUPABASE]**
   - Environments: ✅ Production, ✅ Preview, ✅ Development
5. **IMPORTANTE:** Faça um **Redeploy**:
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**

**Opção B: Via CLI**

```bash
# Remover a variável antiga
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

# Adicionar a nova (cole a chave quando pedir)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

# Redeploy
vercel --prod --force
```

### 3. Verificar se Funcionou

Após o redeploy:
1. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
2. Tente fazer login novamente
3. O erro "Invalid API key" deve desaparecer

## Por que isso acontece?

A chave `anon public` pode ter sido:
- Regenerada no Supabase
- Copiada incorretamente
- Substituída por engano

## Valores Esperados

**URL (deve estar correta):**
```
https://bjnrzexclawzyotdtdfa.supabase.co
```

**ANON KEY (precisa ser verificada no Supabase Dashboard):**
- Vá em Settings → API
- Copie a chave **anon public**
- Ela deve começar com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ⚠️ IMPORTANTE

- Use a chave **anon public**, NÃO a service_role
- A chave deve ter pelo menos 200 caracteres
- Após atualizar, SEMPRE faça redeploy

