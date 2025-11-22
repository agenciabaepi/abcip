# 🚨 PROBLEMA ENCONTRADO: Bucket não existe!

O erro `"Bucket not found"` significa que o bucket `uploads` **não foi criado** no Supabase Storage.

## ✅ SOLUÇÃO RÁPIDA (2 minutos):

### Passo 1: Criar o Bucket

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **Storage**
4. Clique no botão **"New bucket"** ou **"Create a new bucket"**
5. Configure:
   - **Name**: `uploads` (exatamente assim, em minúsculas)
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (muito importante!)
6. Clique em **"Create bucket"**

### Passo 2: Verificar se foi criado

1. Você deve ver o bucket `uploads` na lista
2. Clique nele para abrir
3. Verifique se está marcado como **Public**

### Passo 3: Testar

1. Recarregue a página de banners no admin
2. A imagem deve aparecer agora!

---

## ❓ Por que isso aconteceu?

O código tenta fazer upload para o bucket `uploads`, mas se ele não existe, o Supabase retorna erro 404. As políticas RLS só funcionam se o bucket existir primeiro.

---

## 🔍 Se ainda não funcionar após criar o bucket:

Execute este script no SQL Editor do Supabase para garantir que as políticas estão corretas:

```sql
-- Remove políticas antigas
DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete uploads" ON storage.objects;

-- Cria políticas corretas
CREATE POLICY "Public read uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated insert uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated delete uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);
```

