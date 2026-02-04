# Script de Deploy para Vercel - Windows
# Tenta encontrar Git e Node.js automaticamente

Write-Host "🚀 Iniciando deploy para Vercel..." -ForegroundColor Green

# Função para encontrar Git
function Find-Git {
    $gitPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:ProgramFiles\Git\cmd\git.exe"
    )
    
    # Tentar comando git primeiro (se estiver no PATH)
    try {
        $null = git --version 2>$null
        return "git"
    } catch {}
    
    # Tentar caminhos comuns
    foreach ($path in $gitPaths) {
        if (Test-Path $path) {
            return "`"$path`""
        }
    }
    
    return $null
}

# Função para encontrar Node.js
function Find-Node {
    $nodePaths = @(
        "C:\Program Files\nodejs\node.exe",
        "C:\Program Files (x86)\nodejs\node.exe",
        "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
        "$env:APPDATA\npm\node.exe"
    )
    
    # Tentar comando node primeiro (se estiver no PATH)
    try {
        $null = node --version 2>$null
        return "node"
    } catch {}
    
    # Tentar caminhos comuns
    foreach ($path in $nodePaths) {
        if (Test-Path $path) {
            return "`"$path`""
        }
    }
    
    return $null
}

# Encontrar Git
$gitCmd = Find-Git
if (-not $gitCmd) {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Ou adicione Git ao PATH do Windows." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git encontrado" -ForegroundColor Green

# Verificar se estamos em um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "❌ Este diretório não é um repositório Git" -ForegroundColor Red
    exit 1
}

# Verificar status
Write-Host "`n📋 Verificando alterações..." -ForegroundColor Cyan
& $gitCmd status

# Verificar se há alterações para commitar
$status = & $gitCmd status --porcelain
if ($status) {
    Write-Host "`n📝 Alterações detectadas!" -ForegroundColor Yellow
    $response = Read-Host "Deseja fazer commit? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        & $gitCmd add .
        $commitMessage = Read-Host "Mensagem do commit (Enter para padrão)"
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "Atualização: Remover campo de resumo das notícias"
        }
        & $gitCmd commit -m $commitMessage
        Write-Host "✅ Commit realizado!" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Nenhuma alteração pendente" -ForegroundColor Green
}

# Verificar se há commits para push
$branch = & $gitCmd rev-parse --abbrev-ref HEAD
$upstream = & $gitCmd rev-parse --abbrev-ref --symbolic-full-name @{u} 2>$null
$localCommit = & $gitCmd rev-parse @ 2>$null
$remoteCommit = & $gitCmd rev-parse @{u} 2>$null

if ($localCommit -ne $remoteCommit -or $upstream) {
    Write-Host "`n📤 Enviando para o repositório remoto..." -ForegroundColor Cyan
    & $gitCmd push
    Write-Host "✅ Push realizado!" -ForegroundColor Green
    Write-Host "`n🎉 Deploy acionado na Vercel!" -ForegroundColor Green
    Write-Host "📊 Acompanhe: https://vercel.com/dashboard" -ForegroundColor Cyan
} else {
    Write-Host "`n✅ Tudo está atualizado. Não há nada para fazer push." -ForegroundColor Green
    Write-Host "💡 Para forçar redeploy, acesse: https://vercel.com/dashboard" -ForegroundColor Yellow
}

