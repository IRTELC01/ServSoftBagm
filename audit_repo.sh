#!/usr/bin/env bash
set -e

REPORT="repo_audit_$(date +%Y%m%d_%H%M%S).log"

echo "===============================" | tee $REPORT
echo " AUDITORÍA DEL REPOSITORIO" | tee -a $REPORT
echo "===============================" | tee -a $REPORT
echo "" | tee -a $REPORT

echo "📌 Información general" | tee -a $REPORT
echo "Ruta: $(pwd)" | tee -a $REPORT
echo "Usuario: $(whoami)" | tee -a $REPORT
echo "Fecha: $(date)" | tee -a $REPORT
echo "" | tee -a $REPORT

echo "🔍 Estado Git" | tee -a $REPORT
if [ -d ".git" ]; then
  git status -sb | tee -a $REPORT
else
  echo "❌ No es un repositorio Git" | tee -a $REPORT
fi
echo "" | tee -a $REPORT

echo "🐳 Docker" | tee -a $REPORT
docker --version 2>/dev/null || echo "❌ Docker no instalado" | tee -a $REPORT
docker compose version 2>/dev/null || echo "❌ Docker Compose no disponible" | tee -a $REPORT
echo "" | tee -a $REPORT

echo "📂 Archivos críticos" | tee -a $REPORT
FILES=(
  docker-compose.yml
  Dockerfile
  .env
  package.json
  package-lock.json
  README.md
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    echo "✅ $f" | tee -a $REPORT
  else
    echo "❌ FALTA $f" | tee -a $REPORT
  fi
done
echo "" | tee -a $REPORT

echo "🧱 Estructura del proyecto" | tee -a $REPORT
find . -maxdepth 2 -type d | tee -a $REPORT
echo "" | tee -a $REPORT

echo "🟢 Node / npm" | tee -a $REPORT
node -v 2>/dev/null || echo "❌ Node no instalado" | tee -a $REPORT
npm -v 2>/dev/null || echo "❌ npm no instalado" | tee -a $REPORT
echo "" | tee -a $REPORT

if [ -f "package.json" ]; then
  echo "📦 Auditoría de dependencias (npm audit)" | tee -a $REPORT
  npm audit --audit-level=high || true
fi

echo "" | tee -a $REPORT
echo "✅ Auditoría finalizada" | tee -a $REPORT
echo "Reporte generado: $REPORT"
