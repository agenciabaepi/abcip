# Configuração do Sistema de Vídeos

## Passo 1: Executar o SQL no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `supabase/create-videos-table.sql`
6. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

Isso criará:
- A tabela `videos` no banco de dados
- As políticas RLS (Row Level Security) necessárias
- Os índices para melhor performance

## Passo 2: Adicionar Vídeos no Painel Admin

1. Acesse o painel admin: `/admin/videos`
2. Clique em **Novo Vídeo**
3. Preencha os campos:
   - **Título**: Nome do vídeo
   - **Descrição**: Descrição opcional
   - **URL do YouTube**: Cole a URL completa do vídeo
     - Formatos aceitos:
       - `https://www.youtube.com/watch?v=VIDEO_ID`
       - `https://youtu.be/VIDEO_ID`
   - **Ordem de Exibição**: Número para ordenar (menor = aparece primeiro)
   - **Vídeo Ativo**: Marque para exibir na homepage
4. Clique em **Criar Vídeo**

## Passo 3: Verificar na Homepage

A seção de vídeos aparecerá na homepage após a seção CTA, mas apenas se:
- Houver pelo menos um vídeo marcado como **Ativo**
- Os vídeos serão exibidos em um grid responsivo (1 coluna no mobile, 2 no tablet, 3 no desktop)

## Funcionalidades

### VideoCard
- **Thumbnail automática**: O sistema extrai automaticamente a thumbnail do YouTube
- **Player integrado**: Ao clicar no botão play, o vídeo é reproduzido em um iframe do YouTube
- **Design moderno**: Cards com hover effects e animações suaves
- **Responsivo**: Adapta-se perfeitamente a diferentes tamanhos de tela

### Gerenciamento no Admin
- **Listagem**: Veja todos os vídeos cadastrados com preview da thumbnail
- **Edição**: Edite título, descrição, URL, ordem e status
- **Exclusão**: Remova vídeos que não são mais necessários
- **Ordenação**: Controle a ordem de exibição através do campo `order_index`
- **Ativação/Desativação**: Mostre ou oculte vídeos sem excluí-los

## Estrutura da Seção de Vídeos

A seção de vídeos tem:
- **Título**: "Nossos Vídeos"
- **Descrição**: Texto explicativo
- **Grid responsivo**: 
  - Mobile: 1 coluna
  - Tablet: 2 colunas
  - Desktop: 3 colunas
- **Cards modernos**: Cada vídeo em um card com thumbnail, título e descrição

## Notas Técnicas

- O sistema extrai automaticamente o ID do vídeo a partir da URL do YouTube
- A thumbnail é gerada automaticamente usando a API do YouTube
- Os vídeos são carregados via iframe do YouTube (sem necessidade de hospedar os arquivos)
- A ordem de exibição é controlada pelo campo `order_index` (menor número = aparece primeiro)

