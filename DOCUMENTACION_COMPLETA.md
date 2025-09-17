# 📚 WorkEscrow - Documentación Técnica Completa

## 🚀 ¿Cómo Probar el Sistema?

### Método 1: Remix IDE (¡SIN INSTALAR NADA!)

**¿Qué es Remix?** Un sitio web donde puedes probar contratos inteligentes gratis.

#### 🔧 Pasos Súper Detallados:

**PASO 1: Abrir Remix**
1. Abre tu navegador (Chrome, Firefox, etc.)
2. Ve a: [remix.ethereum.org](https://remix.ethereum.org)
3. Espera que cargue completamente

**PASO 2: Subir los Contratos**
1. En el lado izquierdo, busca "FILE EXPLORER"
2. Click en la carpeta `contracts/`
3. Click derecho → "New File"
4. Nombre: `MockERC20.sol`
5. Copia y pega el código de `contracts/MockERC20.sol`
6. Repite para `WorkEscrow.sol`

**PASO 3: Compilar**
1. Click en el ícono de Solidity (💎 diamante) en el lado izquierdo
2. Asegúrate que dice versión `0.8.28`
3. Activa "Auto compile"
4. Click "Compile MockERC20.sol" → espera ✅
5. Click "Compile WorkEscrow.sol" → espera ✅

**PASO 4: Deploy (Poner en Funcionamiento)**
1. Click en "Deploy & Run Transactions" (ícono 🔷)
2. Environment: selecciona `Remix VM (Cancun)`

**Deploy MockERC20 (Token de Prueba):**
- Contract: `MockERC20`
- Parámetros: `"USD Coin", "USDC", 6`
- Click "Deploy"
- **🎯 COPIA LA DIRECCIÓN** que aparece (algo como `0x123...abc`)

**Deploy WorkEscrow (Contrato Principal):**
- Contract: `WorkEscrow`  
- Parámetro: `"0x123...abc"` (la dirección de MockERC20)
- Click "Deploy"

**PASO 5: Probar el Flujo Completo**

**5.1 Dar dinero al cliente:**
- En MockERC20 → función `mint`
- Parámetros: `"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "1000000000"`
- Click "transact"

**5.2 Aprobar el contrato:**
- En MockERC20 → función `approve`  
- Parámetros: `"DIRECCIÓN_DE_WORKESCROW", "1000000000"`
- Click "transact"

**5.3 Crear trabajo:**
- En WorkEscrow → función `createWork`
- Parámetros: `"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", 100000000, "Crear página web", "Sitio web con React", 0`
- Click "transact"

**5.4 Trabajador acepta (cambiar cuenta):**
- Arriba en "Account" cambiar a: `0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2`
- En WorkEscrow → función `acceptWork`
- Parámetro: `1`
- Click "transact"

**5.5 Trabajador entrega:**
- Mismo worker → función `submitWork`
- Parámetros: `1, "https://mi-pagina-web.com"`
- Click "transact"

**5.6 Cliente aprueba y paga:**
- Cambiar account al cliente: `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`
- En WorkEscrow → función `approveWork`
- Parámetro: `1`
- Click "transact"

**🎉 ¡LISTO! El trabajador recibió su pago automáticamente**

### 🔍 Verificar Resultados

**Ver estado del trabajo:**
- WorkEscrow → función `getWork` (azul)
- Parámetro: `1`
- Debería mostrar status: `3` (Completed)

**Ver balance del trabajador:**
- MockERC20 → función `balanceOf` (azul)
- Parámetro: `"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"`
- Debería mostrar: `100000000` (100 tokens)

---

## 💻 Para Desarrolladores: Instalación Local

### Prerequisitos
- Node.js 22+ ([descargar aquí](https://nodejs.org))
- Git ([descargar aquí](https://git-scm.com))

### Instalación

```bash
# Clonar proyecto
git clone <tu-repositorio>
cd smart-contractors

# Instalar dependencias
npm install

# Compilar contratos
npm run compile
```

### Scripts Disponibles

```bash
# Testing
npm run test                    # Todos los tests
npm run test:workescrow        # Solo tests de WorkEscrow

# Deploy local
npm run deploy:local           # Deploy en red local
npm run interact:local         # Interactuar con contrato local

# Deploy Sepolia testnet
npm run deploy:sepolia         # Deploy en Sepolia (requiere .env)
npm run interact:sepolia       # Interactuar en Sepolia

# Utilidades
npm run compile               # Compilar contratos
npm run clean                # Limpiar artifacts
npm run node                 # Iniciar red local
```

### Configuración para Sepolia

Crear archivo `.env`:

```env
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/TU_PROJECT_ID"
SEPOLIA_PRIVATE_KEY="tu_private_key_sin_0x"
```

---

## 🏗️ Arquitectura Técnica

### Contratos

**`WorkEscrow.sol`** - Contrato principal
- 📊 Maneja estados de trabajos
- 💰 Controla flujo de pagos
- 🔐 Implementa seguridad y access control

**`MockERC20.sol`** - Token de prueba
- 🪙 Simula USDC para testing
- ⚡ Permite mint/burn ilimitado
- ⚠️ SOLO PARA TESTING

### Estados del Trabajo

```solidity
enum WorkStatus {
    Created,    // 0 - Trabajo creado
    InProgress, // 1 - Worker asignado  
    Submitted,  // 2 - Trabajo entregado
    Completed,  // 3 - Aprobado y pagado
    Cancelled   // 4 - Cancelado por cliente
}
```

### Eventos Principales

```solidity
WorkCreated(workId, client, worker, amount, title)
WorkAccepted(workId, worker)  
WorkSubmitted(workId, deliveryData)
WorkApproved(workId, client, worker, amount)
WorkCancelled(workId, client)
```

### Seguridad

- **ReentrancyGuard**: Previene ataques de reentrada
- **Pausable**: Función de emergencia  
- **Ownable**: Control de acceso administrativo
- **SafeERC20**: Transferencias seguras de tokens

---

## 🚨 Troubleshooting - Problemas Comunes

### Error: "Gas estimation failed"
**Solución:** Aumentar Gas Limit a `500000`

### Error: "Execution reverted" 
**Posibles causas:**
1. **Balance insuficiente** → Verificar con `balanceOf`
2. **No hay approve** → Hacer `approve` primero
3. **Estado incorrecto** → Verificar con `getWork`
4. **Cuenta incorrecta** → Cambiar account en Remix

### Error: "Not the assigned worker"
**Solución:** Cambiar la cuenta activa en Remix al worker correcto

### Error: "Work does not exist" 
**Solución:** Verificar que el workId existe (empezar desde 1)

### Error: "Cannot cancel work in current status"
**Solución:** Solo se puede cancelar trabajos en estado Created o InProgress

### MockERC20 no aparece en deploy
**Solución:** Verificar compilación, usar la versión simple incluida

---

## 📚 Glosario de Términos

**🔗 Blockchain**: Red de computadoras que mantiene un registro compartido y seguro

**💰 Token**: Dinero digital (como USDC, equivalente a dólares)

**📝 Smart Contract**: Programa que se ejecuta automáticamente en blockchain

**🔐 Escrow**: Sistema donde el dinero se guarda hasta cumplir condiciones

**⛽ Gas**: Costo computacional de ejecutar operaciones en blockchain  

**🔑 Wallet**: "Billetera digital" para guardar tokens y firmar transacciones

**📊 Testnet**: Blockchain de prueba (sin dinero real)

**🎯 Deploy**: Proceso de subir un contrato a blockchain

**✅ Mint**: Crear tokens nuevos (solo para testing)

**👥 Address**: Dirección única que identifica cuentas (como `0x123...abc`)

---

## 🤝 Casos de Uso Reales

### 💻 Desarrollo Web
- **Cliente**: Necesito una landing page
- **Escrow**: $800 guardados hasta entrega
- **Resultado**: Página entregada, pago automático

### 🎨 Diseño Gráfico  
- **Cliente**: Diseño de logo para mi empresa
- **Escrow**: $300 en garantía
- **Resultado**: Logo aprobado, diseñador cobró

### ✍️ Contenido
- **Cliente**: 10 artículos para blog
- **Escrow**: $500 depositados
- **Resultado**: Artículos entregados a tiempo, pago liberado

### 📱 Desarrollo Mobile
- **Cliente**: App iOS simple
- **Escrow**: $2000 seguros en contrato
- **Resultado**: App funcionando, desarrollador satisfecho

---

## ⚠️ Limitaciones y Consideraciones

### En Testnet
- ✅ **Perfecto para**: Testing, demos, aprendizaje
- ❌ **NO usar para**: Dinero real, producción

### Para Producción
- 🔍 **Requiere**: Auditoría de seguridad
- ⚖️ **Considerar**: Sistema de disputas
- 📋 **Agregar**: Límites de montos, rate limiting
- 🏛️ **Legal**: Cumplimiento regulatorio

### Límites Técnicos
- 🌐 **Solo funciona**: Con wallets compatibles (MetaMask)
- ⛽ **Costos**: Gas fees en mainnet
- ⏱️ **Velocidad**: Depende de congestión de red

---

## 🎯 Próximos Pasos

### Versión 1.0 (Actual)
- ✅ Contrato funcional
- ✅ Testing completo
- ✅ Deploy en testnet

### Versión 2.0 (Futuro)
- 🔮 **Sistema de disputas**: Árbitros automáticos
- 🎨 **Frontend web**: Interface visual completa
- 📱 **App mobile**: iOS y Android
- 💼 **Multi-token**: Soporte para diferentes monedas

### Versión 3.0 (Visión)
- 🤖 **IA integrada**: Evaluación automática de entregas
- 🔗 **Cross-chain**: Funcionar en múltiples blockchains
- 👥 **DAO governance**: Comunidad decide mejoras
- 🏪 **Marketplace**: Plataforma completa de freelancing

---

## 📞 Soporte y Contribución

### ¿Tienes Preguntas?
1. 📖 **Lee este README** completo
2. 🧪 **Prueba en Remix** siguiendo la guía
3. 🐛 **Reporta bugs** con detalles específicos
4. 💡 **Sugiere mejoras** son bienvenidas

### ¿Quieres Contribuir?
1. 🍴 Fork del proyecto
2. 🌿 Crear branch de feature
3. 🧪 Agregar tests para nuevas funciones
4. 📝 Documentar cambios
5. 🔄 Pull request con descripción clara

---

## 📄 Licencia

ISC - Libre para usar, modificar y distribuir.

---

**🚀 ¡WorkEscrow - El futuro del trabajo digital seguro está aquí!**
