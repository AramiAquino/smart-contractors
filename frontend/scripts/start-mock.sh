#!/bin/bash

# Script para iniciar WorkEscrow Frontend en modo mock
echo "🚀 Iniciando WorkEscrow Frontend en modo MOCK..."
echo "📱 No necesitas MetaMask ni contratos desplegados"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Execute este script desde el directorio 'frontend'"
    echo "   Uso: cd frontend && ./scripts/start-mock.sh"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Copiar configuración mock si no existe .env.local
if [ ! -f ".env.local" ]; then
    echo "⚙️  Configurando archivo de entorno..."
    cp .env.mock .env.local
fi

# Asegurar que NEXT_PUBLIC_ENABLE_MOCKS esté en true
export NEXT_PUBLIC_ENABLE_MOCKS=true

echo "✅ Todo listo!"
echo ""
echo "🎯 Funcionalidades disponibles:"
echo "   • Dashboard completo con estadísticas"
echo "   • 8 trabajos de ejemplo en diferentes estados"
echo "   • Crear, aceptar, entregar y aprobar trabajos"
echo "   • Sistema completo de notificaciones"
echo "   • Diseño responsive para móvil y desktop"
echo ""
echo "🌐 Abriendo en http://localhost:3000"
echo "🔧 Modo DESARROLLO con datos simulados"
echo ""

# Iniciar servidor de desarrollo
npm run dev:mock
