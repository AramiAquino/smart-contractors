# WorkEscrow - Plataforma de Trabajos Digitales con Pago Seguro

[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19.0-yellow.svg)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue.svg)](https://www.typescriptlang.org/)

> **WorkEscrow** es un sistema de escrow descentralizado que permite contratar y pagar trabajos digitales de forma segura usando tecnología blockchain. Los fondos se mantienen en custodia hasta que el trabajo sea completado y aprobado por ambas partes.

## Tabla de Contenidos

- [Problema a Resolver](#problema-a-resolver)
- [Cómo Funciona](#cómo-funciona)
- [Inicio Rápido](#inicio-rápido)
- [Para Desarrolladores](#para-desarrolladores)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Problema a Resolver

### Desafíos Actuales en el Mercado de Trabajo Digital
El mercado de freelancing digital enfrenta problemas significativos de confianza y seguridad en pagos:

- **Riesgo de Pago**: Los clientes arriesgan pagar por trabajo que puede nunca entregarse
- **Riesgo de No Pago**: Los trabajadores arriesgan completar trabajo sin garantía de pago
- **Resolución de Disputas**: Falta de mecanismos transparentes y automatizados de resolución
- **Barreras de Confianza**: Altas barreras de entrada debido a problemas de confianza entre partes desconocidas

### Nuestra Solución: WorkEscrow
WorkEscrow proporciona un sistema de escrow descentralizado que:

- **Asegura Pagos**: Los fondos se mantienen en contratos inteligentes hasta completar el trabajo
- **Automatiza Flujo de Trabajo**: Gestión transparente y automatizada del estado del trabajo
- **Elimina Intermediarios**: Transacciones directas peer-to-peer con ejecución por contrato inteligente
- **Garantiza Equidad**: Ambas partes están protegidas mediante garantías criptográficas

---

## Cómo Funciona

### Arquitectura del Sistema

**Cliente** - Parte que solicita que se complete un trabajo
**Trabajador** - Parte que realiza el trabajo solicitado
**Contrato Inteligente** - Sistema de escrow automatizado que gestiona fondos y flujo de trabajo

### Proceso de Flujo de Trabajo

```
1. CREACIÓN DE TRABAJO
   El cliente crea una solicitud de trabajo con monto de pago
   Los fondos se depositan en el contrato inteligente de escrow

2. ACEPTACIÓN DE TRABAJO
   El trabajador acepta la asignación de trabajo
   El estado del trabajo cambia a "En Progreso"

3. ENTREGA DE TRABAJO
   El trabajador entrega el trabajo completado con datos de entrega
   El estado del trabajo cambia a "Entregado"

4. APROBACIÓN DE TRABAJO
   El cliente revisa y aprueba el trabajo entregado
   Los fondos se liberan automáticamente al trabajador

5. COMPLETADO
   La transacción está completa y registrada en blockchain
```

### Características de Seguridad

- **Seguridad Blockchain**: Los fondos están asegurados por garantías criptográficas
- **Transparencia**: Todas las transacciones son públicamente verificables
- **Automatización**: Ningún intermediario humano puede manipular el proceso
- **Inmutabilidad**: Todas las acciones están permanentemente registradas y son auditables

---

## 🚀 ¿Cómo Probarlo AHORA MISMO?

### ⭐ Método Súper Fácil: Remix IDE

**🎯 En solo 5 minutos puedes probar todo el sistema sin instalar nada:**

1. **Ve a:** [remix.ethereum.org](https://remix.ethereum.org)
2. **Sigue la guía paso a paso** en [`DOCUMENTACION_COMPLETA.md`](./DOCUMENTACION_COMPLETA.md)
3. **¡Listo!** Habrás creado, aceptado, entregado y pagado un trabajo digital

**📖 ¿Necesitas ayuda?** La documentación completa tiene **cada click explicado** para que no te pierdas.

---

## 💻 Para Desarrolladores

### Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/AramiAquino/smart-contractors.git
cd smart-contractors

# 2. Instalar dependencias
npm install

# 3. Instalar dependencia adicional si es necesaria
npm install --save-dev ts-node --legacy-peer-deps

# 4. Compilar contratos
npm run compile

# 5. Ejecutar tests
npm run test

# 6. Deployar contratos localmente
npm run deploy:local

# 7. Interactuar con los contratos
npm run interact:local
```

### Scripts Principales

```bash
# Testing
npm run test                    # Todos los tests
npm run test:workescrow        # Solo tests de WorkEscrow

# Deploy
npm run deploy:local           # Deploy en red local hardhat
npm run deploy:sepolia         # Deploy en Sepolia testnet

# Interacción
npm run interact:local         # Probar funcionamiento local
npm run interact:sepolia       # Probar funcionamiento en Sepolia

# Utilidades
npm run compile               # Compilar contratos
npm run clean                # Limpiar artifacts
npm run node                 # Iniciar nodo local hardhat
```

**📚 Documentación técnica completa:** [`DOCUMENTACION_COMPLETA.md`](./DOCUMENTACION_COMPLETA.md)
**🛠️ Stack tecnológico detallado:** [`TECNOLOGIAS_DETALLADAS.md`](./TECNOLOGIAS_DETALLADAS.md)
**🎨 Integración frontend:** [`INTEGRACION_FRONTEND.md`](./INTEGRACION_FRONTEND.md)

---

## 🛠️ Stack Tecnológico

### **Core Technologies**
- **🔷 Solidity 0.8.28** - Lenguaje para smart contracts
- **⚒️ Hardhat 2.19.0** - Framework de desarrollo
- **🛡️ OpenZeppelin 5.4.0** - Librerías de seguridad auditadas
- **📘 TypeScript 5.8.0** - Type safety y mejor desarrollo
- **🔗 Ethers.js 6.15.0** - Interacción con blockchain
- **🔌 Hardhat Ethers 3.1.0** - Plugin para integración con ethers

### **Blockchain & Networks**
- **🌐 Ethereum** - Blockchain principal
- **🧪 Sepolia Testnet** - Testing con dinero ficticio
- **🎮 Remix IDE** - Testing visual sin instalación
- **🦊 MetaMask** - Wallet integration

### **Security & Standards**
- **💰 ERC20** - Estándar de tokens (USDC)
- **🔒 ReentrancyGuard** - Protección contra ataques
- **⏸️ Pausable** - Funciones de emergencia
- **👑 Access Control** - Permisos granulares

### **Testing & Quality**
- **🧪 Mocha + Chai** - Framework de testing
- **📊 10 Test Cases** - Cobertura completa de funcionalidades principales
- **🔍 Gas Optimization** - Costos optimizados
- **✅ Funcionalidades Probadas** - Todos los flujos principales funcionan

**🔧 ¿Quieres los detalles técnicos?** Ver [`TECNOLOGIAS_DETALLADAS.md`](./TECNOLOGIAS_DETALLADAS.md)

---

## 🏗️ ¿Qué Incluye Este Proyecto?

### 📁 Estructura del Proyecto

```
smart-contractors/
├── contracts/
│   ├── WorkEscrow.sol      # 🎯 Contrato principal
│   └── MockERC20.sol       # 🪙 Token de prueba
├── test/
│   └── WorkEscrow.ts       # 🧪 Tests completos (35+ casos)
├── scripts/
│   ├── deploy-workescrow.ts    # 🚀 Deploy a testnet
│   └── interact-workescrow.ts  # 🎮 Script de interacción
├── README.md               # 📖 Esta guía
└── DOCUMENTACION_COMPLETA.md   # 📚 Guía técnica detallada
```

### ✅ Funcionalidades Implementadas

- **🔐 Escrow seguro**: Dinero guardado hasta completar trabajo
- **📊 Estados claros**: Created → InProgress → Submitted → Completed
- **💰 Pagos automáticos**: Sin intermediarios humanos
- **🛡️ Seguridad robusta**: ReentrancyGuard, Pausable, Access Control
- **🎯 Testing funcional**: 10 casos de prueba cubriendo flujos principales
- **📝 Eventos detallados**: Historial completo de acciones

---

## 🎉 ¿Listo Para Empezar?

### Para Usuarios (Sin Conocimiento Técnico)
👉 **[DOCUMENTACION_COMPLETA.md](./DOCUMENTACION_COMPLETA.md)** - Guía paso a paso súper detallada

### Para Desarrolladores
👉 **Clona el repo** y ejecuta `npm run test:workescrow`

### Para Desarrolladores Frontend
👉 **[INTEGRACION_FRONTEND.md](./INTEGRACION_FRONTEND.md)** - Guía completa de integración con React/Vue/Angular

### Para Curiosos
👉 **Ve directamente a [remix.ethereum.org](https://remix.ethereum.org)** y prueba el contrato

---

## 🚨 ¿Problemas?

**📖 Solución 1:** Lee la sección Troubleshooting en [`DOCUMENTACION_COMPLETA.md`](./DOCUMENTACION_COMPLETA.md)

**🔍 Solución 2:** Todos los errores comunes tienen solución explicada paso a paso

**💡 Solución 3:** El sistema está probado y funciona - si algo falla, es configuración

---

## Contribuir

¡Damos la bienvenida a las contribuciones a WorkEscrow! 

### Configuración de Desarrollo
1. Haz fork del repositorio
2. Crea una rama de funcionalidad (`git checkout -b feature/funcionalidad-increible`)
3. Confirma tus cambios (`git commit -m 'Agregar funcionalidad increíble'`)
4. Envía a la rama (`git push origin feature/funcionalidad-increible`)
5. Abre un Pull Request

### Pautas de Contribución
- Sigue los estándares de código existentes
- Incluye tests para nueva funcionalidad
- Actualiza la documentación según sea necesario
- Asegúrate de que todos los tests pasen

## Licencia

Este proyecto está licenciado bajo la Licencia ISC - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Agradecimientos

- Construido con el framework [Hardhat](https://hardhat.org/)
- Patrones de seguridad de [OpenZeppelin](https://openzeppelin.com/)
- Testing en [Sepolia Testnet](https://sepolia.etherscan.io/)

---

**WorkEscrow - Plataforma Segura de Trabajo Digital**

[Pruébalo ahora en Remix IDE →](https://remix.ethereum.org)