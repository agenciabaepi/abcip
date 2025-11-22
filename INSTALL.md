# Guia de Instalação - ABCIP

Este guia detalha passo a passo como configurar o projeto ABCIP.

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git (opcional)

## Passo 1: Configurar o Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name**: ABCIP (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a região mais próxima
5. Aguarde a criação do projeto (pode levar alguns minutos)

### 1.2 Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Verifique se todas as tabelas foram criadas (vá em **Table Editor**)

### 1.3 Configurar Storage

1. No painel do Supabase, vá em **Storage**
2. Clique em **Create a new bucket**
3. Configure:
   - **Name**: `uploads`
   - **Public bucket**: ✅ Marque como público
4. Clique em **Create bucket**
5. Vá em **Policies** do bucket `uploads`
6. Adicione uma política para leitura pública:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**: `true`
7. Adicione uma política para upload (apenas autenticados):
   - **Policy name**: `Authenticated upload`
   - **Allowed operation**: `INSERT`
   - **Policy definition**: `auth.role() = 'authenticated'`

### 1.4 Configurar Autenticação

1. No painel do Supabase, vá em **Authentication** > **Providers**
2. Certifique-se de que **Email** está habilitado
3. Configure as opções conforme necessário:
   - **Enable email confirmations**: Opcional (recomendado desabilitar para desenvolvimento)
   - **Secure email change**: Opcional

### 1.5 Criar Usuário Admin

1. Vá em **Authentication** > **Users**
2. Clique em **Add user** > **Create new user**
3. Preencha:
   - **Email**: seu-email@exemplo.com
   - **Password**: crie uma senha forte
4. Clique em **Create user**
5. **Anote essas credenciais!** Você usará para fazer login no painel admin

### 1.6 Obter Credenciais da API

1. No painel do Supabase, vá em **Settings** > **API**
2. Anote:
   - **Project URL** (será `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (será `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (será `SUPABASE_SERVICE_ROLE_KEY`) - **Mantenha esta secreta!**

## Passo 2: Configurar o Projeto Local

### 2.1 Instalar Dependências

```bash
npm install
```

### 2.2 Criar Arquivo de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

**⚠️ IMPORTANTE**: 
- Substitua os valores pelos que você anotou no passo 1.6
- Nunca commite o arquivo `.env.local` no Git
- O arquivo já está no `.gitignore`

### 2.3 Executar o Projeto

```bash
npm run dev
```

O site estará disponível em: `http://localhost:3000`

## Passo 3: Testar o Sistema

### 3.1 Testar o Site Público

1. Acesse `http://localhost:3000`
2. Navegue pelas páginas:
   - Página inicial
   - Notícias
   - Quem Somos
   - Associados
   - Contato

### 3.2 Testar o Painel Admin

1. Acesse `http://localhost:3000/admin/login`
2. Faça login com as credenciais criadas no passo 1.5
3. Teste as funcionalidades:
   - Criar uma notícia
   - Adicionar um banner
   - Adicionar um associado
   - Editar "Quem Somos"
   - Ver mensagens de contato
   - Configurar rodapé

## Passo 4: Primeiros Passos

### 4.1 Adicionar Conteúdo Inicial

1. **Banners**: Adicione pelo menos um banner na página inicial
2. **Quem Somos**: Edite o conteúdo da página institucional
3. **Rodapé**: Configure endereço, telefone e redes sociais
4. **Notícias**: Crie algumas notícias de exemplo

### 4.2 Personalizar

- Edite as cores em `tailwind.config.ts`
- Ajuste os textos e conteúdos padrão
- Adicione seu logo (substitua "ABCIP" no header)

## Troubleshooting

### Erro: "Invalid API key"

- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que copiou as chaves corretas do Supabase
- Reinicie o servidor após alterar `.env.local`

### Erro: "relation does not exist"

- Execute o schema SQL novamente no Supabase
- Verifique se todas as tabelas foram criadas

### Erro ao fazer upload de imagens

- Verifique se o bucket `uploads` foi criado
- Verifique as políticas do bucket
- Certifique-se de estar logado no painel admin

### Erro 404 ao acessar rotas admin

- Certifique-se de estar logado
- Verifique se o middleware está funcionando
- Limpe o cache do navegador

## Próximos Passos

- Configure um domínio personalizado
- Faça deploy em produção (Vercel recomendado)
- Configure backups do banco de dados
- Adicione mais usuários admin se necessário
- Configure notificações por email para mensagens de contato

## Suporte

Se encontrar problemas, verifique:
1. Logs do Supabase (Dashboard > Logs)
2. Console do navegador (F12)
3. Terminal onde o Next.js está rodando

