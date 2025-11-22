# ABCIP - Site Institucional

Site institucional completo com painel administrativo para a ABCIP (Concessionária de Iluminação Pública).

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Backend (banco de dados, autenticação, storage)
- **React Hook Form** - Gerenciamento de formulários
- **React Hot Toast** - Notificações
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones

## 📋 Funcionalidades

### Front-end
- ✅ Página inicial com banner rotativo
- ✅ Seção de serviços
- ✅ Listagem de notícias com paginação
- ✅ Páginas individuais de notícias
- ✅ Página "Quem Somos"
- ✅ Página de Associados
- ✅ Página de Contato com formulário
- ✅ Sistema de busca
- ✅ Rodapé editável
- ✅ Design responsivo e moderno

### Painel Administrativo
- ✅ Sistema de login seguro
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento completo de notícias (CRUD)
- ✅ Gerenciamento de banners
- ✅ Gerenciamento de associados
- ✅ Edição da página "Quem Somos"
- ✅ Visualização de mensagens de contato
- ✅ Configurações gerais do site
- ✅ Configurações do rodapé

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd ABCIP
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. No SQL Editor, execute o script `supabase/schema.sql` para criar as tabelas
4. Configure o Storage:
   - Vá em Storage
   - Crie um bucket chamado `uploads`
   - Configure as políticas de acesso (público para leitura)

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### 5. Configure a autenticação no Supabase

1. Vá em Authentication > Providers
2. Habilite o provider Email
3. Configure as opções de autenticação conforme necessário

### 6. Crie o primeiro usuário admin

No SQL Editor do Supabase, execute:

```sql
-- Insira um usuário manualmente (você precisará criar a senha hash)
-- Ou use a interface de autenticação do Supabase para criar o primeiro usuário
```

**Nota:** Para criar o primeiro usuário, você pode:
- Usar a interface de autenticação do Supabase (Authentication > Users > Add User)
- Ou criar via SQL (mas você precisará gerar o hash da senha)

### 7. Execute o projeto

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
ABCIP/
├── app/                    # Páginas Next.js (App Router)
│   ├── admin/              # Painel administrativo
│   ├── noticias/           # Páginas de notícias
│   ├── quem-somos/         # Página institucional
│   ├── associados/         # Página de associados
│   ├── contato/            # Página de contato
│   └── busca/              # Página de busca
├── components/              # Componentes React
│   ├── admin/              # Componentes do painel
│   └── ...                 # Componentes públicos
├── lib/                     # Utilitários e configurações
│   ├── supabase/           # Clientes Supabase
│   └── types.ts            # Tipos TypeScript
├── supabase/               # Scripts SQL
│   └── schema.sql          # Schema do banco de dados
└── public/                 # Arquivos estáticos
```

## 🔐 Acesso ao Painel Admin

1. Acesse `/admin/login`
2. Faça login com as credenciais criadas no Supabase
3. Após o login, você será redirecionado para o dashboard

## 📝 Uso do Painel

### Gerenciar Notícias
- Acesse "Notícias" no menu lateral
- Clique em "Nova Notícia" para criar
- Edite ou exclua notícias existentes
- Use HTML no campo de conteúdo para formatação

### Gerenciar Banners
- Acesse "Banners" no menu lateral
- Adicione imagens para o banner rotativo da homepage
- Configure ordem, título, subtítulo e link

### Gerenciar Associados
- Acesse "Associados" no menu lateral
- Adicione logos de empresas associadas
- Configure nome e website (opcional)

### Editar "Quem Somos"
- Acesse "Quem Somos" no menu lateral
- Edite título, conteúdo e imagem
- Use HTML para formatação do conteúdo

### Visualizar Mensagens
- Acesse "Mensagens" no menu lateral
- Veja todas as mensagens recebidas pelo formulário de contato

### Configurações
- Acesse "Configurações" no menu lateral
- Edite informações gerais do site
- Configure informações do rodapé (endereço, telefone, redes sociais)

## 🎨 Personalização

### Cores
As cores podem ser personalizadas em `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Suas cores personalizadas
  }
}
```

### Estilos
Os estilos globais estão em `app/globals.css`

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Faça o deploy

### Outros provedores
O projeto pode ser deployado em qualquer plataforma que suporte Next.js.

## 📄 Licença

Este projeto é proprietário da ABCIP.

## 🆘 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

