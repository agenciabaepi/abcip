# Troubleshooting - Problemas de Login

## Verificações Necessárias

### 1. Variáveis de Ambiente na Vercel

Certifique-se de que as variáveis estão configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Como verificar:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `abcip`
3. Vá em **Settings** → **Environment Variables**
4. Verifique se ambas as variáveis estão presentes e marcadas para **Production**, **Preview** e **Development**

### 2. Usuário Existe no Supabase?

O usuário padrão é:
- **Email:** `abcip@admin.com`
- **Senha:** `123456`

**Como criar/verificar o usuário:**

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** → **Users**
4. Se o usuário não existir, clique em **Add User** → **Create new user**
5. Preencha:
   - Email: `abcip@admin.com`
   - Password: `123456`
   - Auto Confirm User: ✅ (marcado)

### 3. Verificar Logs de Erro

**No navegador (Console):**
1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Tente fazer login
4. Veja as mensagens de erro

**Na Vercel:**
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `abcip`
3. Vá em **Deployments**
4. Clique no último deployment
5. Veja os logs de build e runtime

### 4. Testar Localmente

Se funcionar localmente mas não na Vercel:
- Verifique se as variáveis de ambiente estão configuradas na Vercel
- Faça um redeploy após configurar as variáveis

### 5. Limpar Cache

Se o problema persistir:
1. Limpe o cache do navegador
2. Use uma janela anônima
3. Tente fazer login novamente

## Erros Comuns

### "Configuração do Supabase não encontrada"
- **Causa:** Variáveis de ambiente não configuradas
- **Solução:** Configure as variáveis na Vercel (passo 1)

### "Invalid login credentials"
- **Causa:** Email ou senha incorretos, ou usuário não existe
- **Solução:** Verifique/crie o usuário no Supabase (passo 2)

### "Erro ao sincronizar sessão"
- **Causa:** Problema na API route ou variáveis de ambiente no servidor
- **Solução:** Verifique as variáveis na Vercel e faça redeploy

### Redirecionamento infinito
- **Causa:** Sessão não está sendo salva corretamente
- **Solução:** Verifique os cookies no DevTools → Application → Cookies

## Comandos Úteis

```bash
# Ver variáveis de ambiente na Vercel
vercel env ls

# Fazer redeploy forçado
vercel --prod --force

# Ver logs do último deployment
vercel logs
```

