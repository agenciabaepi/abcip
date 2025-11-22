# Deploy na Vercel - Configuração

## ⚠️ IMPORTANTE: Variáveis de Ambiente

Antes do deploy funcionar completamente, você precisa adicionar as variáveis de ambiente do Supabase no painel da Vercel.

### Passo a Passo:

1. **Acesse o painel da Vercel:**
   - Vá para: https://vercel.com/dashboard
   - Selecione o projeto `abcip`

2. **Adicione as variáveis de ambiente:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione as seguintes variáveis:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bjnrzexclawzyotdtdfa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnJ6ZXhjbGF3enlvdGR0ZGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDczNTMsImV4cCI6MjA3OTMyMzM1M30.rWkwul8iEeacGbfjX8XLiX_oHJO2NyAf9TNhzMjjCZw
   ```

3. **Selecione os ambientes:**
   - Marque todas as opções: **Production**, **Preview**, e **Development**

4. **Redeploy:**
   - Após adicionar as variáveis, vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**

## Alternativa: Via CLI

Você também pode adicionar as variáveis via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Cole: https://bjnrzexclawzyotdtdfa.supabase.co
# Selecione: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnJ6ZXhjbGF3enlvdGR0ZGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDczNTMsImV4cCI6MjA3OTMyMzM1M30.rWkwul8iEeacGbfjX8XLiX_oHJO2NyAf9TNhzMjjCZw
# Selecione: Production, Preview, Development
```

Depois, faça um novo deploy:

```bash
vercel --prod
```

## Status Atual

✅ Build compilado com sucesso  
✅ Código enviado para produção  
⚠️ Variáveis de ambiente precisam ser configuradas  
⚠️ Algumas páginas falharam no prerender devido às variáveis ausentes

Após configurar as variáveis e fazer o redeploy, o site estará 100% funcional!

