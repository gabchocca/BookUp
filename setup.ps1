
$UV_CMD               = "uv"
$UV_INSTALL_URL       = "https://astral.sh"

$FNM_CMD              = "fnm"
$FNM_WINGET_ID        = "Schniz.fnm"
$WINGET_SOURCE        = "winget"

$NODE_VERSION         = "26"

$TSC_CMD              = "tsc"
$TSC_NPM_PKG          = "typescript"

$NG_CMD               = "ng"
$NG_NPM_PKG           = "@angular/cli"

# Comandos 
$CMD_INSTALL_UV       = "irm $UV_INSTALL_URL | iex"
$CMD_INSTALL_FNM      = "winget install --source $WINGET_SOURCE $FNM_WINGET_ID --accept-source-agreements --accept-package-agreements"
$CMD_FNM_ENV          = "$FNM_CMD env --use-on-cd --shell powershell"
$CMD_FNM_INSTALL_NODE = "$FNM_CMD install $NODE_VERSION"
$CMD_FNM_USE_NODE     = "$FNM_CMD use $NODE_VERSION"
$CMD_INSTALL_TSC      = "npm install -g $TSC_NPM_PKG"
$CMD_INSTALL_NG       = "npm install -g $NG_NPM_PKG"
# ==============================================================================

# Recargar PATH
function Update-SessionPath {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}

Write-Host "--- 1. Verificando $UV_CMD ---" -ForegroundColor Cyan
if (-not (Get-Command $UV_CMD -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando $UV_CMD..." -ForegroundColor Yellow
    powershell -ExecutionPolicy ByPass -c $CMD_INSTALL_UV
    Update-SessionPath
} else {
    Write-Host "$UV_CMD ya está instalado. Omitiendo." -ForegroundColor Green
}

Write-Host "`n--- 2. Verificando $FNM_CMD ---" -ForegroundColor Cyan
if (-not (Get-Command $FNM_CMD -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando $FNM_CMD..." -ForegroundColor Yellow
    Invoke-Expression $CMD_INSTALL_FNM
    Update-SessionPath
} else {
    Write-Host "$FNM_CMD ya está instalado. Omitiendo." -ForegroundColor Green
}

Write-Host "`n--- 3. Configurando entorno de Node.js (v$NODE_VERSION) ---" -ForegroundColor Cyan
if (Get-Command $FNM_CMD -ErrorAction SilentlyContinue) {
    Invoke-Expression $CMD_FNM_ENV | Out-String | Invoke-Expression
    Invoke-Expression $CMD_FNM_INSTALL_NODE
    Invoke-Expression $CMD_FNM_USE_NODE
} else {
    Write-Error "No se encontró $FNM_CMD en el PATH. Cierra y vuelve a abrir la terminal e intenta de nuevo."
    exit 1
}

Write-Host "`n--- 4. Verificando paquetes globales de npm ---" -ForegroundColor Cyan
if (-not (Get-Command $TSC_CMD -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando $TSC_NPM_PKG..." -ForegroundColor Yellow
    Invoke-Expression $CMD_INSTALL_TSC
} else {
    Write-Host "$TSC_NPM_PKG ya está instalado. Omitiendo." -ForegroundColor Green
}

if (-not (Get-Command $NG_CMD -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando $NG_NPM_PKG..." -ForegroundColor Yellow
    Invoke-Expression $CMD_INSTALL_NG
} else {
    Write-Host "$NG_NPM_PKG ya está instalado. Omitiendo." -ForegroundColor Green
}

Write-Host "`n¡Entorno listo!" -ForegroundColor Green
