# 🔧 Configuração do Storage - Passo a Passo

## ⚠️ IMPORTANTE: A imagem não carrega porque o bucket precisa estar configurado!

Siga estes passos **EXATAMENTE** na ordem:

## Passo 1: Criar o Bucket

1. Acesse o **Supabase Dashboard**
2. Vá em **Storage** (no menu lateral)
3. Clique em **"Create a new bucket"**
4. Configure:
   - **Name**: `uploads` (exatamente assim, em minúsculas)
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (muito importante!)
5. Clique em **"Create bucket"**

## Passo 2: Executar as Políticas RLS

1. No Supabase Dashboard, vá em **SQL Editor**
2. Abra o arquivo `supabase/storage-policies.sql` do projeto
3. **Copie TODO o conteúdo** do arquivo
4. Cole no SQL Editor do Supabase
5. Clique em **"Run"** (ou pressione Ctrl+Enter)
6. Verifique se apareceu a mensagem de sucesso

## Passo 3: Verificar se Funcionou

1. Volte para **Storage** > **uploads** > **Policies**
2. Você deve ver 4 políticas:
   - `Public read uploads` (SELECT)
   - `Authenticated insert uploads` (INSERT)
   - `Authenticated update uploads` (UPDATE)
   - `Authenticated delete uploads` (DELETE)

## Passo 4: Testar

1. Recarregue a página de banners no admin
2. A imagem deve aparecer agora

## ❌ Se ainda não funcionar:

1. Verifique se o bucket está marcado como **público**
2. Verifique se as políticas foram criadas (veja Passo 3)
3. Abra o console do navegador (F12) e veja se há erros ao carregar a imagem
4. Tente acessar a URL da imagem diretamente no navegador:
   - Exemplo: `https://bjnrzexclawzyotdtdfa.supabase.co/storage/v1/object/public/uploads/banners/1763758649236-su9cm.jpg`
   - Se der erro 403 ou 404, as políticas não estão corretas

## 🔍 Verificar URL da Imagem

A URL da imagem deve ter este formato:
```
https://[seu-projeto].supabase.co/storage/v1/object/public/uploads/banners/[nome-do-arquivo]
```

Se a URL estiver diferente, pode ser que o `getPublicUrl` não esteja funcionando corretamente.

