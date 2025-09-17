# 🎨 Ejemplo de Integración Frontend - Next.js

Este es un ejemplo completo de cómo integrar WorkEscrow con una aplicación Next.js.

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

## 📁 Estructura del Proyecto

```
nextjs-example/
├── components/
│   ├── WorkEscrowApp.tsx      # Componente principal
│   ├── WorkForm.tsx           # Formulario de creación
│   ├── WorkList.tsx           # Lista de trabajos
│   ├── WorkCard.tsx           # Tarjeta individual
│   └── WalletConnect.tsx      # Conexión de wallet
├── hooks/
│   └── useWeb3.ts             # Hook de Web3
├── services/
│   ├── ContractService.ts     # Servicio de contratos
│   └── EventService.ts        # Servicio de eventos
├── config/
│   └── networks.ts            # Configuración de redes
├── abis/
│   ├── WorkEscrow.json        # ABI del contrato
│   └── MockERC20.json         # ABI del token
├── pages/
│   └── index.tsx              # Página principal
└── styles/
    └── globals.css            # Estilos globales
```

## 🔧 Configuración

### Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### Configuración de Redes

```typescript
// config/networks.ts
export const NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Test Network',
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_PROJECT_ID'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};
```

## 🎯 Funcionalidades

- ✅ Conexión con MetaMask
- ✅ Creación de trabajos
- ✅ Aceptación de trabajos
- ✅ Entrega de trabajos
- ✅ Aprobación y pago
- ✅ Lista de trabajos en tiempo real
- ✅ Manejo de estados
- ✅ Notificaciones de eventos

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 🚀 Deploy

```bash
# Build de producción
npm run build

# Deploy a Vercel
vercel

# Deploy a Netlify
npm run build && netlify deploy --prod --dir=out
```

## 📚 Documentación

Para más detalles, consulta la [guía completa de integración](../INTEGRACION_FRONTEND.md).

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
