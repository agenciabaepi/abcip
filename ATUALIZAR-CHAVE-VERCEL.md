# 🔧 ATUALIZAR CHAVE NA VERCEL - PASSO A PASSO

## ⚠️ PROBLEMA ENCONTRADO

A chave `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel está **diferente** da chave no seu `.env.local`.

## ✅ SOLUÇÃO RÁPIDA

### 1. Acesse a Vercel Dashboard

https://vercel.com/dashboard → Projeto `abcip`

### 2. Vá em Settings → Environment Variables

### 3. DELETE a variável antiga

- Encontre `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Clique nos três pontos (...)
- Selecione **Delete**
- Confirme a exclusão

### 4. ADD a nova variável

Clique em **Add New** e preencha:

- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Cole esta chave (do seu .env.local):
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnJ6ZXhjbGF3enlvdGR0ZGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDczNTMsImV4cCI6MjA3OTMyMzM1M30.rWkwul8iEeacGbfjX8XLi8_oHJO2NyAf9TNhzMjjCZw
  ```
- **Environments:** Marque todas:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development

### 5. FAÇA REDEPLOY (OBRIGATÓRIO!)

1. Vá em **Deployments**
2. Clique nos **três pontos (...)** do último deployment
3. Selecione **Redeploy**
4. Aguarde o build completar

### 6. Teste o Login

Após o redeploy:
- Limpe o cache do navegador (Ctrl+Shift+R)
- Acesse `/admin/login`
- Tente fazer login
- O erro "Invalid API key" deve desaparecer!

## 🔍 Diferença Encontrada

**Chave antiga (na Vercel):**
```
...rWkwul8iEeacGbfjX8XLiX_oHJO2NyAf9TNhzMjjCZw
```

**Chave correta (no .env.local):**
```
...rWkwul8iEeacGbfjX8XLi8_oHJO2NyAf9TNhzMjjCZw
```

Note a diferença: `LiX_` vs `Li8_`

## ⚡ Comando Rápido (Alternativa)

Se preferir via CLI, execute cada comando separadamente:

```bash
# Remover (um por vez)
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY preview  
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY development

# Adicionar (um por vez, cole a chave quando pedir)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnJ6ZXhjbGF3enlvdGR0ZGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDczNTMsImV4cCI6MjA3OTMyMzM1M30.rWkwul8iEeacGbfjX8XLi8_oHJO2NyAf9TNhzMjjCZw

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
# Cole a mesma chave

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
# Cole a mesma chave

# Redeploy
vercel --prod --force
```

