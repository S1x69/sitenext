@echo off
echo ====================================
echo   ADMIN PANEL - Porta 3001
echo ====================================
echo.
cd /d "c:\xampp\htdocs\projetos\siteNext\sitenext\admin-panel"

echo Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo Iniciando Admin Panel em http://localhost:3001
echo.
call npm run dev

pause
