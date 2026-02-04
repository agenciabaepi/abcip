#!/bin/bash

# Script de Upload via FTP para cPanel
# Uso: ./upload-ftp.sh

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📤 Script de Upload FTP para cPanel${NC}"
echo ""

# Verificar se o diretório de deploy existe
if [ ! -d "deploy-cpanel" ]; then
    echo -e "${RED}❌ Erro: Diretório 'deploy-cpanel' não encontrado!${NC}"
    echo "Execute primeiro: ./deploy-cpanel.sh"
    exit 1
fi

# Solicitar credenciais FTP
read -p "🌐 Host FTP (ex: ftp.seusite.com): " FTP_HOST
read -p "👤 Usuário FTP: " FTP_USER
read -s -p "🔒 Senha FTP: " FTP_PASS
echo ""
read -p "📁 Diretório remoto (ex: /public_html ou /www): " FTP_DIR
read -p "🔌 Porta FTP (padrão 21): " FTP_PORT
FTP_PORT=${FTP_PORT:-21}

echo ""
echo -e "${YELLOW}📤 Iniciando upload...${NC}"

# Verificar se lftp está instalado
if command -v lftp &> /dev/null; then
    echo -e "${GREEN}✅ Usando lftp...${NC}"
    
    lftp -c "
    set ftp:ssl-allow no
    set ftp:passive-mode yes
    open -u $FTP_USER,$FTP_PASS -p $FTP_PORT $FTP_HOST
    cd $FTP_DIR
    lcd deploy-cpanel
    mirror --reverse --delete --verbose --exclude-glob .git*
    bye
    "
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Upload concluído com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro no upload!${NC}"
        exit 1
    fi
elif command -v ftp &> /dev/null; then
    echo -e "${YELLOW}⚠️  lftp não encontrado, usando ftp básico...${NC}"
    echo -e "${YELLOW}⚠️  Recomendado instalar lftp para melhor experiência${NC}"
    
    # Criar script temporário para ftp
    FTP_SCRIPT=$(mktemp)
    cat > $FTP_SCRIPT << EOF
cd $FTP_DIR
binary
prompt off
mput deploy-cpanel/*
quit
EOF
    
    ftp -n $FTP_HOST $FTP_PORT << EOF
user $FTP_USER $FTP_PASS
$(cat $FTP_SCRIPT)
EOF
    
    rm $FTP_SCRIPT
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Upload concluído!${NC}"
    else
        echo -e "${RED}❌ Erro no upload!${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Erro: Nenhum cliente FTP encontrado!${NC}"
    echo "Instale lftp: brew install lftp (macOS) ou apt-get install lftp (Linux)"
    exit 1
fi

echo ""
echo -e "${GREEN}✨ Upload finalizado!${NC}"
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Acesse o cPanel"
echo "2. Configure a aplicação Node.js (veja INSTRUCOES-DEPLOY.md)"
echo "3. Configure as variáveis de ambiente"
echo "4. Inicie a aplicação"

