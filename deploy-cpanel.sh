#!/bin/bash

# Script de Deploy para cPanel
# Este script prepara o projeto Next.js para deploy no cPanel

echo "🚀 Preparando projeto para deploy no cPanel..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Criar diretório de deploy
DEPLOY_DIR="deploy-cpanel"
echo -e "${YELLOW}📦 Criando diretório de deploy...${NC}"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Instalar dependências (se necessário)
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Instalando dependências...${NC}"
    npm install
fi

# Fazer build do projeto em modo standalone
echo -e "${YELLOW}🔨 Fazendo build do Next.js (modo standalone)...${NC}"
NEXT_OUTPUT=standalone npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build!${NC}"
    exit 1
fi

# Copiar arquivos necessários
echo -e "${YELLOW}📋 Copiando arquivos...${NC}"

# Se o build foi feito em modo standalone, copiar a pasta standalone
if [ -d ".next/standalone" ]; then
    echo -e "${GREEN}✅ Modo standalone detectado!${NC}"
    cp -r .next/standalone/* $DEPLOY_DIR/
    # Criar diretório .next se não existir
    mkdir -p $DEPLOY_DIR/.next
    cp -r .next/static $DEPLOY_DIR/.next/static
    cp -r public $DEPLOY_DIR/public
else
    # Fallback: copiar tudo normalmente
    echo -e "${YELLOW}⚠️  Modo standalone não encontrado, copiando arquivos completos...${NC}"
    
    # Copiar .next (build)
    cp -r .next $DEPLOY_DIR/
    
    # Copiar public
    cp -r public $DEPLOY_DIR/
    
    # Copiar arquivos de configuração
    cp package.json $DEPLOY_DIR/
    cp next.config.js $DEPLOY_DIR/
    cp tsconfig.json $DEPLOY_DIR/ 2>/dev/null || true
    cp tailwind.config.js $DEPLOY_DIR/ 2>/dev/null || true
    cp postcss.config.js $DEPLOY_DIR/ 2>/dev/null || true
    
    # Copiar app directory
    cp -r app $DEPLOY_DIR/
    
    # Copiar components
    cp -r components $DEPLOY_DIR/ 2>/dev/null || true
    
    # Copiar lib
    cp -r lib $DEPLOY_DIR/
fi

# Criar arquivo .env.example
echo -e "${YELLOW}📝 Criando arquivo .env.example...${NC}"
cat > $DEPLOY_DIR/.env.example << 'EOF'
# Variáveis de Ambiente do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bjnrzexclawzyotdtdfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
EOF

# Criar arquivo .htaccess para Next.js
echo -e "${YELLOW}📝 Criando arquivo .htaccess...${NC}"
cat > $DEPLOY_DIR/.htaccess << 'EOF'
# Next.js Rewrite Rules
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle Next.js routes
  RewriteRule ^_next/static/(.*)$ /_next/static/$1 [L]
  RewriteRule ^_next/image(.*)$ /_next/image$1 [L]
  RewriteRule ^api/(.*)$ /api/$1 [L]
  
  # Handle all other routes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>
EOF

# Criar arquivo server.js para Node.js no cPanel
echo -e "${YELLOW}📝 Criando arquivo server.js...${NC}"

# Se estiver em modo standalone, o server.js já existe
if [ ! -f "$DEPLOY_DIR/server.js" ]; then
    cat > $DEPLOY_DIR/server.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
EOF
fi

# Criar package.json simplificado para produção (se não existir)
if [ ! -f "$DEPLOY_DIR/package.json" ]; then
    echo -e "${YELLOW}📝 Criando package.json para produção...${NC}"
    cat > $DEPLOY_DIR/package.json << 'EOF'
{
  "name": "abcip-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  }
}
EOF
fi

# Criar arquivo de instruções
echo -e "${YELLOW}📝 Criando arquivo de instruções...${NC}"
cat > $DEPLOY_DIR/INSTRUCOES-DEPLOY.md << 'EOF'
# 📋 Instruções de Deploy no cPanel

## Passo 1: Upload dos Arquivos

1. Acesse o **File Manager** no cPanel
2. Navegue até a pasta do seu domínio (geralmente `public_html` ou `www`)
3. Faça upload de TODOS os arquivos da pasta `deploy-cpanel`

## Passo 2: Configurar Aplicação Node.js

1. No cPanel, vá em **Node.js** (na seção "Software")
2. Clique em **"+ CRIAR APLICAÇÃO"**
3. Configure:
   - **Versão do Node.js**: Selecione a versão 18.x ou superior
   - **Modo de aplicação**: Production
   - **Diretório raiz**: `/public_html` (ou o diretório onde você fez upload)
   - **URL**: Deixe em branco ou coloque `/`
   - **Arquivo de inicialização**: `server.js`
   - **Porta**: Deixe o padrão (geralmente 3000)
4. Clique em **Criar**

## Passo 3: Instalar Dependências

1. Na aplicação Node.js criada, clique em **"npm install"**
2. Aguarde a instalação completar

## Passo 4: Configurar Variáveis de Ambiente

1. Na aplicação Node.js, clique em **"Variáveis de Ambiente"** ou **"Environment Variables"**
2. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://bjnrzexclawzyotdtdfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
NODE_ENV=production
PORT=3000
```

**⚠️ IMPORTANTE**: Substitua `sua_chave_anon_aqui` pela chave real do Supabase!

Para obter a chave:
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie a chave **anon public**

## Passo 5: Iniciar Aplicação

1. Na aplicação Node.js, clique em **"Iniciar"** ou **"Start"**
2. Aguarde alguns segundos para a aplicação iniciar

## Passo 6: Configurar Domínio (Opcional)

Se você quiser usar um domínio específico:

1. No cPanel, vá em **Domínios** → **Adicionar Domínio**
2. Configure o domínio para apontar para a aplicação Node.js

## Passo 7: Verificar

1. Acesse seu site no navegador
2. Verifique se está funcionando corretamente

## ⚠️ Troubleshooting

### Erro: "Cannot find module"
- Execute `npm install` novamente na aplicação Node.js

### Erro: "Port already in use"
- Pare outras aplicações Node.js ou mude a porta

### Site não carrega
- Verifique se a aplicação está rodando (status "Running")
- Verifique os logs na aplicação Node.js
- Verifique se as variáveis de ambiente estão configuradas

### Imagens não carregam
- Verifique se a pasta `public` foi enviada corretamente
- Verifique as permissões dos arquivos (deve ser 644 para arquivos, 755 para pastas)

## 📞 Suporte

Se tiver problemas, verifique:
1. Logs da aplicação Node.js no cPanel
2. Logs do servidor (se tiver acesso)
3. Console do navegador (F12) para erros JavaScript
EOF

echo -e "${GREEN}✅ Deploy preparado com sucesso!${NC}"
echo -e "${GREEN}📁 Arquivos prontos em: $DEPLOY_DIR${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Leia o arquivo: $DEPLOY_DIR/INSTRUCOES-DEPLOY.md"
echo "2. Faça upload dos arquivos via FTP ou File Manager do cPanel"
echo "3. Configure a aplicação Node.js no cPanel"
echo ""
echo -e "${GREEN}✨ Boa sorte com o deploy!${NC}"

