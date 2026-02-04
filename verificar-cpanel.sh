#!/bin/bash

# Script para verificar e corrigir estrutura no cPanel

echo "🔍 Verificando estrutura no servidor..."

FTP_HOST="ftp.abcip.com.br"
FTP_USER="abcip@abcip.com.br"
FTP_PASS="@Deusefiel7loja2025"
FTP_PORT="21"

lftp -c "
set ftp:ssl-allow no
set ftp:passive-mode yes
open -u $FTP_USER,$FTP_PASS -p $FTP_PORT $FTP_HOST
cd /
echo '=== ESTRUTURA ATUAL ==='
ls -la
echo ''
echo '=== VERIFICANDO public_html ==='
ls -la public_html/ 2>&1 | head -10
echo ''
echo '=== VERIFICANDO abcip ==='
ls -la abcip/ 2>&1 | head -10
echo ''
echo '=== VERIFICANDO .next ==='
ls -la .next/ 2>&1 | head -10
bye
"

echo ""
echo "✅ Verificação concluída!"
echo ""
echo "Se os arquivos estiverem na raiz (/), precisamos movê-los para public_html"
echo "Ou se estiverem em public_html/abcip, precisamos movê-los para public_html/"

