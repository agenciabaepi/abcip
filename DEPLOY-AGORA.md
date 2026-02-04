# Deploy do site ABCIP

## 1. Garantir que o build passa

Na raiz do projeto (fora do Google Drive se estiver lento):

```bash
npm install
npm run build
```

Se der timeout, tente de novo ou rode em uma pasta local (cópia do projeto).

---

## 2. Opção A: Deploy na Vercel (recomendado para Next.js)

### Se o projeto já está ligado ao repositório na Vercel

Basta enviar as alterações para o Git:

```bash
git add .
git commit -m "Deploy: configurações, editor rico, visualizações, etc."
git push origin main
```

A Vercel faz o build e o deploy automaticamente.

### Se quiser fazer deploy pela CLI

```bash
npx vercel --prod
```

(Você precisa estar logado: `npx vercel login`)

---

## 2. Opção B: Deploy no cPanel

1. Na raiz do projeto, rode:

```bash
chmod +x deploy-cpanel.sh
./deploy-cpanel.sh
```

2. Será criada a pasta **`deploy-cpanel`** com o build pronto.
3. Envie o **conteúdo** dessa pasta para o servidor (FTP ou File Manager do cPanel).
4. Siga o **`deploy-cpanel/INSTRUCOES-DEPLOY.md`** para configurar a aplicação Node.js e as variáveis de ambiente no cPanel.

---

## Variáveis de ambiente (Vercel ou cPanel)

Configure:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No cPanel, se o admin precisar atualizar senhas via script, use também:

- `SUPABASE_SERVICE_ROLE_KEY` (só no servidor/backend, nunca no front)
