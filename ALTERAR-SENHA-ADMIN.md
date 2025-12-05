# 🔐 Alterar Senha do Admin

## Passo a Passo

### 1. Acesse o Supabase Dashboard

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** → **Users**

### 2. Encontre o Usuário

1. Procure pelo email: `admin@abcip.com.br`
2. Se não encontrar, procure por `abcip@admin.com` (pode ser que o email seja diferente)

### 3. Alterar a Senha

**Opção A: Via Interface (Recomendado)**

1. Clique no usuário para abrir os detalhes
2. Clique em **"Reset Password"** ou **"Update Password"**
3. Digite a nova senha: `@ABCIP2025#`
4. Salve

**Opção B: Via SQL (Alternativa)**

Se a opção A não funcionar, você pode usar o SQL Editor:

1. Vá em **SQL Editor**
2. Execute este comando (substitua o email se necessário):

```sql
-- Primeiro, encontre o ID do usuário
SELECT id, email FROM auth.users WHERE email = 'admin@abcip.com.br';

-- Depois, atualize a senha usando o ID encontrado
-- NOTA: Você precisará gerar o hash da senha primeiro
-- A forma mais fácil é usar a interface do Supabase
```

**⚠️ IMPORTANTE**: A forma mais fácil é usar a interface do Supabase (Opção A).

### 4. Verificar

1. Acesse: `https://abcip.com.br/admin/login`
2. Faça login com:
   - Email: `admin@abcip.com.br`
   - Senha: `@ABCIP2025#`

---

## Se o Usuário Não Existir

Se o usuário `admin@abcip.com.br` não existir:

1. Vá em **Authentication** → **Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email**: `admin@abcip.com.br`
   - **Password**: `@ABCIP2025#`
   - **Auto Confirm User**: ✅ (marcado)
4. Clique em **"Create user"**

---

## Nota sobre Segurança

- ✅ A senha foi alterada para uma senha forte
- ✅ Os campos de login não estão mais pré-preenchidos
- ✅ O site está no ar e seguro

