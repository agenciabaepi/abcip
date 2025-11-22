# 🔴 SOLUÇÃO: Erro "Invalid API key"

## Problema

O erro "Invalid API key" aparece porque as variáveis de ambiente `NEXT_PUBLIC_*` **não estão sendo expostas corretamente no build do Next.js na Vercel**.

## Solução Passo a Passo

### 1. Verificar Variáveis na Vercel

Execute:
```bash
vercel env ls
```

Deve mostrar:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅

### 2. **IMPORTANTE: Redeploy Obrigatório**

Após configurar variáveis na Vercel, **SEMPRE faça um redeploy**:

**Opção A: Via Dashboard**
1. Acesse: https://vercel.com/dashboard
2. Projeto `abcip` → **Deployments**
3. Clique nos **três pontos (...)** do último deployment
4. Selecione **Redeploy**

**Opção B: Via CLI**
```bash
vercel --prod --force
```

### 3. Verificar se as Variáveis Estão no Build

As variáveis `NEXT_PUBLIC_*` são injetadas no build time, não em runtime. Se você adicionou as variáveis mas não fez redeploy, elas não estarão disponíveis.

### 4. Valores Corretos

Certifique-se de que os valores estão corretos:

**NEXT_PUBLIC_SUPABASE_URL:**
```
https://bjnrzexclawzyotdtdfa.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnJ6ZXhjbGF3enlvdGR0ZGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDczNTMsImV4cCI6MjA3OTMyMzM1M30.rWkwul8iEeacGbfjX8XLiX_oHJO2NyAf9TNhzMjjCZw
```

### 5. Testar no Console do Navegador

Após o redeploy, abra o console (F12) e execute:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

Se retornar `undefined`, as variáveis não foram incluídas no build.

### 6. Se Ainda Não Funcionar

1. **Remova e readicione as variáveis:**
   - Vercel Dashboard → Settings → Environment Variables
   - Delete as variáveis existentes
   - Adicione novamente com os valores corretos
   - Marque todas as opções: Production, Preview, Development

2. **Faça um redeploy completo:**
   ```bash
   vercel --prod --force
   ```

3. **Limpe o cache do navegador** e teste novamente

## Por que isso acontece?

No Next.js, variáveis `NEXT_PUBLIC_*` são injetadas **durante o build**, não em runtime. Se você:
- Adiciona variáveis na Vercel
- Mas não faz redeploy
- As variáveis não estarão disponíveis no código do cliente

## Checklist Final

- [ ] Variáveis configuradas na Vercel
- [ ] Variáveis marcadas para Production, Preview e Development
- [ ] Redeploy feito após configurar variáveis
- [ ] Cache do navegador limpo
- [ ] Testado em janela anônima

