# Configuração da Seção CTA (Call to Action)

## Passo 1: Executar o SQL no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `supabase/create-cta-section.sql`
6. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

Isso criará:
- A tabela `cta_section` no banco de dados
- As políticas RLS (Row Level Security) necessárias
- Um registro padrão (inativo) para você editar

## Passo 2: Configurar a CTA no Painel Admin

1. Acesse o painel admin: `/admin/cta`
2. Preencha os campos:
   - **Título**: Ex: "Faça Parte"
   - **Descrição**: Texto descritivo sobre associar-se
   - **Texto do Botão**: Ex: "Associe-se"
   - **Link do Botão**: Ex: `/contato` ou uma URL externa
   - **Imagem**: Faça upload de uma imagem (recomendado: proporção 4:5, vertical)
   - **CTA Ativa**: Marque para exibir na homepage
3. Clique em **Salvar CTA**

## Passo 3: Verificar na Homepage

A seção CTA aparecerá na homepage após a seção "Nossos Serviços", mas apenas se:
- A CTA estiver marcada como **Ativa**
- Todos os campos obrigatórios estiverem preenchidos

## Estrutura da CTA

A seção CTA tem um design moderno com:
- Fundo gradiente escuro (cor primária #031C30)
- Layout responsivo (imagem à esquerda, conteúdo à direita no desktop)
- Botão destacado na cor secundária (#5FE074)
- Efeitos visuais sutis (blur, sombras, gradientes)
- Totalmente responsivo para mobile

## Notas

- A imagem é opcional, mas recomendada para um visual mais atraente
- O link do botão pode ser interno (`/contato`) ou externo (`https://...`)
- Você pode desativar a CTA a qualquer momento desmarcando "CTA Ativa"
- A imagem será armazenada no bucket `uploads` do Supabase Storage, na pasta `cta/`

