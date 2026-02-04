# Script para fazer deploy na Vercel
# Tenta encontrar Git e fazer push automático

Write-Host "Tentando fazer deploy para Vercel..." -ForegroundColor Green
Write-Host ""

# Tentar encontrar Git em varios locais
$gitPaths = @(
    "git",
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "$env:ProgramFiles\Git\cmd\git.exe",
    "$env:ProgramFiles(x86)\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
)

$gitExe = $null
foreach ($path in $gitPaths) {
    try {
        $result = & $path --version 2>&1
        if ($LASTEXITCODE -eq 0 -or $result -match "git version") {
            $gitExe = $path
            Write-Host "[OK] Git encontrado: $path" -ForegroundColor Green
            Write-Host "     Versao: $result" -ForegroundColor Cyan
            break
        }
    } catch {
        # Continuar procurando
    }
}

if (-not $gitExe) {
    Write-Host "[ERRO] Git nao encontrado no PATH ou em locais padrao" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para fazer o deploy, voce tem 3 opcoes:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPCAO 1: Adicionar Git ao PATH e executar novamente" -ForegroundColor Cyan
    Write-Host "  1. Pressione Win + R, digite: sysdm.cpl"
    Write-Host "  2. Aba 'Avancado' -> 'Variaveis de Ambiente'"
    Write-Host "  3. Edite 'Path' em 'Variaveis do Sistema'"
    Write-Host "  4. Adicione: C:\Program Files\Git\cmd"
    Write-Host "  5. Reinicie o PowerShell e execute este script novamente"
    Write-Host ""
    Write-Host "OPCAO 2: Fazer manualmente via Git Bash" -ForegroundColor Cyan
    Write-Host "  1. Abra Git Bash (se tiver instalado)"
    Write-Host "  2. Navegue ate: G:\Meu Drive\ABCIP"
    Write-Host "  3. Execute:"
    Write-Host "     git add ."
    Write-Host "     git commit -m 'Remover campo de resumo das noticias'"
    Write-Host "     git push"
    Write-Host ""
    Write-Host "OPCAO 3: Usar GitHub Desktop ou outra ferramenta Git" -ForegroundColor Cyan
    Write-Host "  Faca commit e push das alteracoes usando a ferramenta que preferir"
    Write-Host ""
    exit 1
}

# Git encontrado, fazer deploy
Write-Host ""
Write-Host "Adicionando arquivos ao Git..." -ForegroundColor Cyan
& $gitExe add .

Write-Host "Verificando status..." -ForegroundColor Cyan
$status = & $gitExe status --short

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "[AVISO] Nenhuma alteracao para fazer commit" -ForegroundColor Yellow
    Write-Host "        Verificando se precisa fazer push..." -ForegroundColor Cyan
    
    $ahead = & $gitExe rev-list --count HEAD..origin/main 2>&1
    if ($LASTEXITCODE -eq 0 -and $ahead -gt 0) {
        Write-Host "Fazendo push para GitHub..." -ForegroundColor Cyan
        & $gitExe push
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Push realizado! A Vercel fara deploy automatico." -ForegroundColor Green
        } else {
            Write-Host "[ERRO] Erro ao fazer push" -ForegroundColor Red
        }
    } else {
        Write-Host "[OK] Tudo esta atualizado. Sem alteracoes para enviar." -ForegroundColor Green
    }
} else {
    Write-Host "Arquivos modificados:" -ForegroundColor Cyan
    Write-Host $status
    Write-Host ""
    
    Write-Host "Fazendo commit..." -ForegroundColor Cyan
    & $gitExe commit -m "Remover campo de resumo das noticias"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Commit realizado com sucesso!" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Fazendo push para GitHub..." -ForegroundColor Cyan
        & $gitExe push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "[SUCCESS] Deploy iniciado!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Acompanhe o deploy em:" -ForegroundColor Cyan
            Write-Host "  https://vercel.com/dashboard" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "A Vercel fara o deploy automaticamente apos o push!" -ForegroundColor Green
        } else {
            Write-Host "[ERRO] Erro ao fazer push para GitHub" -ForegroundColor Red
            Write-Host "       Verifique sua conexao e credenciais do Git" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[ERRO] Erro ao fazer commit" -ForegroundColor Red
    }
}
