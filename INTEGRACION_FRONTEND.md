# 🎨 Integración Frontend con WorkEscrow

> **Guía completa para integrar WorkEscrow con aplicaciones web modernas**

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Arquitectura Frontend](#arquitectura-frontend)
- [Configuración Inicial](#configuración-inicial)
- [Integración Web3](#integración-web3)
- [Ejemplos de Código](#ejemplos-de-código)
- [Manejo de Estados](#manejo-de-estados)
- [Testing Frontend](#testing-frontend)
- [Deploy y Producción](#deploy-y-producción)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Introducción

WorkEscrow puede integrarse con cualquier frontend moderno (React, Vue, Angular, etc.) para crear una interfaz de usuario completa. Esta guía te mostrará cómo conectar tu aplicación web con los contratos inteligentes.

### 🎯 Objetivos de la Integración

- **Conectar con MetaMask**: Autenticación de usuarios
- **Interactuar con contratos**: Crear, aceptar, entregar trabajos
- **Manejar estados**: Sincronización con blockchain
- **Mostrar transacciones**: Historial y estado en tiempo real
- **Gestión de errores**: Manejo robusto de fallos

---

## 🏗️ Arquitectura Frontend

### Componentes Principales

```
Frontend App
├── Web3 Provider (MetaMask/WalletConnect)
├── Contract Interface (Ethers.js)
├── State Management (Redux/Zustand/Context)
├── UI Components
│   ├── WorkList (Lista de trabajos)
│   ├── WorkForm (Crear trabajo)
│   ├── WorkDetails (Detalles del trabajo)
│   └── WalletConnect (Conectar wallet)
└── Services
    ├── ContractService (Interacción con contratos)
    ├── EventService (Escuchar eventos)
    └── NotificationService (Notificaciones)
```

### Flujo de Datos

```
Usuario → UI Component → Contract Service → Blockchain
    ↑                                           ↓
    ← State Management ← Event Listener ← Contract Events
```

---

## ⚙️ Configuración Inicial

### 1. Instalación de Dependencias

```bash
# Para React/Next.js
npm install ethers @metamask/detect-provider
npm install --save-dev @types/node

# Para Vue.js
npm install ethers @metamask/detect-provider
npm install vuex # o Pinia para state management

# Para Angular
npm install ethers @metamask/detect-provider
npm install @angular/core @angular/common
```

### 2. Variables de Entorno

Crea un archivo `.env.local`:

```env
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CHAIN_ID=0xaa36a7
```

### 3. Configuración de Redes

```javascript
// config/networks.js
export const NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7', // 11155111
    chainName: 'Sepolia Test Network',
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_PROJECT_ID'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  hardhat: {
    chainId: '0x7a69', // 31337
    chainName: 'Hardhat Local',
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};
```

---

## 🔌 Integración Web3

### 1. Hook de Web3 (React)

```javascript
// hooks/useWeb3.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
        
        return { provider, signer, account: accounts[0] };
      } else {
        throw new Error('MetaMask no está instalado');
      }
    } catch (error) {
      console.error('Error conectando wallet:', error);
      throw error;
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      console.error('Error cambiando red:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return {
    account,
    provider,
    signer,
    isConnected,
    connectWallet,
    switchNetwork,
  };
};
```

### 2. Servicio de Contratos

```javascript
// services/ContractService.js
import { ethers } from 'ethers';
import WorkEscrowABI from '../abis/WorkEscrow.json';
import MockERC20ABI from '../abis/MockERC20.json';

export class ContractService {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.workEscrow = null;
    this.usdcToken = null;
  }

  async initialize(workEscrowAddress, usdcAddress) {
    this.workEscrow = new ethers.Contract(
      workEscrowAddress,
      WorkEscrowABI,
      this.signer
    );
    
    this.usdcToken = new ethers.Contract(
      usdcAddress,
      MockERC20ABI,
      this.signer
    );
  }

  // Crear un nuevo trabajo
  async createWork(title, description, amount, deadline) {
    try {
      const tx = await this.workEscrow.createWork(
        title,
        description,
        ethers.parseUnits(amount.toString(), 6), // 6 decimals para USDC
        deadline
      );
      
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error creando trabajo:', error);
      throw error;
    }
  }

  // Aceptar un trabajo
  async acceptWork(workId) {
    try {
      const tx = await this.workEscrow.acceptWork(workId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error aceptando trabajo:', error);
      throw error;
    }
  }

  // Entregar trabajo
  async submitWork(workId, deliveryData) {
    try {
      const tx = await this.workEscrow.submitWork(workId, deliveryData);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error entregando trabajo:', error);
      throw error;
    }
  }

  // Aprobar trabajo
  async approveWork(workId) {
    try {
      const tx = await this.workEscrow.approveWork(workId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error aprobando trabajo:', error);
      throw error;
    }
  }

  // Obtener detalles de un trabajo
  async getWork(workId) {
    try {
      const work = await this.workEscrow.works(workId);
      return {
        id: workId,
        client: work.client,
        worker: work.worker,
        amount: ethers.formatUnits(work.amount, 6),
        title: work.title,
        description: work.description,
        status: work.status,
        createdAt: new Date(Number(work.createdAt) * 1000),
        deadline: new Date(Number(work.deadline) * 1000),
        deliveryData: work.deliveryData,
      };
    } catch (error) {
      console.error('Error obteniendo trabajo:', error);
      throw error;
    }
  }

  // Obtener todos los trabajos
  async getAllWorks() {
    try {
      const workCount = await this.workEscrow.nextWorkId();
      const works = [];
      
      for (let i = 1; i < workCount; i++) {
        const work = await this.getWork(i);
        works.push(work);
      }
      
      return works;
    } catch (error) {
      console.error('Error obteniendo trabajos:', error);
      throw error;
    }
  }

  // Aprobar tokens USDC
  async approveUSDC(amount) {
    try {
      const tx = await this.usdcToken.approve(
        await this.workEscrow.getAddress(),
        ethers.parseUnits(amount.toString(), 6)
      );
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error aprobando USDC:', error);
      throw error;
    }
  }

  // Obtener balance de USDC
  async getUSDCBalance(address) {
    try {
      const balance = await this.usdcToken.balanceOf(address);
      return ethers.formatUnits(balance, 6);
    } catch (error) {
      console.error('Error obteniendo balance USDC:', error);
      throw error;
    }
  }
}
```

---

## 🎨 Ejemplos de Código

### 1. Componente Principal (React)

```jsx
// components/WorkEscrowApp.jsx
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { ContractService } from '../services/ContractService';
import WorkList from './WorkList';
import WorkForm from './WorkForm';
import WalletConnect from './WalletConnect';

const WorkEscrowApp = () => {
  const { account, provider, signer, isConnected, connectWallet } = useWeb3();
  const [contractService, setContractService] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && provider && signer) {
      const service = new ContractService(provider, signer);
      service.initialize(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        process.env.NEXT_PUBLIC_USDC_ADDRESS
      );
      setContractService(service);
      loadWorks(service);
    }
  }, [isConnected, provider, signer]);

  const loadWorks = async (service) => {
    try {
      setLoading(true);
      const allWorks = await service.getAllWorks();
      setWorks(allWorks);
    } catch (error) {
      console.error('Error cargando trabajos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkCreated = () => {
    if (contractService) {
      loadWorks(contractService);
    }
  };

  if (!isConnected) {
    return <WalletConnect onConnect={connectWallet} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">WorkEscrow Platform</h1>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Conectado como: {account}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Crear Trabajo</h2>
          <WorkForm 
            contractService={contractService}
            onWorkCreated={handleWorkCreated}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Trabajos Disponibles</h2>
          {loading ? (
            <p>Cargando trabajos...</p>
          ) : (
            <WorkList 
              works={works}
              contractService={contractService}
              currentAccount={account}
              onWorkUpdated={handleWorkCreated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkEscrowApp;
```

### 2. Formulario de Creación de Trabajo

```jsx
// components/WorkForm.jsx
import React, { useState } from 'react';

const WorkForm = ({ contractService, onWorkCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractService) return;

    try {
      setLoading(true);
      setError('');

      // Aprobar USDC primero
      await contractService.approveUSDC(formData.amount);
      
      // Crear trabajo
      const deadline = Math.floor(new Date(formData.deadline).getTime() / 1000);
      await contractService.createWork(
        formData.title,
        formData.description,
        formData.amount,
        deadline
      );

      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        amount: '',
        deadline: '',
      });

      onWorkCreated();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Título del Trabajo
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Monto (USDC)
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="1"
          step="0.01"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Fecha Límite
        </label>
        <input
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Trabajo'}
      </button>
    </form>
  );
};

export default WorkForm;
```

### 3. Lista de Trabajos

```jsx
// components/WorkList.jsx
import React from 'react';
import WorkCard from './WorkCard';

const WorkList = ({ works, contractService, currentAccount, onWorkUpdated }) => {
  const filteredWorks = works.filter(work => {
    // Mostrar trabajos donde el usuario es cliente o worker
    return work.client.toLowerCase() === currentAccount.toLowerCase() ||
           work.worker.toLowerCase() === currentAccount.toLowerCase();
  });

  if (filteredWorks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay trabajos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredWorks.map(work => (
        <WorkCard
          key={work.id}
          work={work}
          contractService={contractService}
          currentAccount={currentAccount}
          onWorkUpdated={onWorkUpdated}
        />
      ))}
    </div>
  );
};

export default WorkList;
```

### 4. Tarjeta de Trabajo Individual

```jsx
// components/WorkCard.jsx
import React, { useState } from 'react';

const WorkCard = ({ work, contractService, currentAccount, onWorkUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [deliveryData, setDeliveryData] = useState('');

  const isClient = work.client.toLowerCase() === currentAccount.toLowerCase();
  const isWorker = work.worker.toLowerCase() === currentAccount.toLowerCase();

  const getStatusText = (status) => {
    const statusMap = {
      0: 'Creado',
      1: 'En Progreso',
      2: 'Entregado',
      3: 'Completado',
      4: 'Cancelado',
    };
    return statusMap[status] || 'Desconocido';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-purple-100 text-purple-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleAcceptWork = async () => {
    try {
      setLoading(true);
      await contractService.acceptWork(work.id);
      onWorkUpdated();
    } catch (error) {
      console.error('Error aceptando trabajo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async () => {
    try {
      setLoading(true);
      await contractService.submitWork(work.id, deliveryData);
      onWorkUpdated();
    } catch (error) {
      console.error('Error entregando trabajo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWork = async () => {
    try {
      setLoading(true);
      await contractService.approveWork(work.id);
      onWorkUpdated();
    } catch (error) {
      console.error('Error aprobando trabajo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{work.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(work.status)}`}>
          {getStatusText(work.status)}
        </span>
      </div>

      <p className="text-gray-600 mb-3">{work.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium">Monto:</span> {work.amount} USDC
        </div>
        <div>
          <span className="font-medium">Cliente:</span> {work.client.slice(0, 6)}...{work.client.slice(-4)}
        </div>
        <div>
          <span className="font-medium">Worker:</span> {work.worker.slice(0, 6)}...{work.worker.slice(-4)}
        </div>
        <div>
          <span className="font-medium">Límite:</span> {work.deadline.toLocaleDateString()}
        </div>
      </div>

      {work.deliveryData && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <span className="font-medium">Datos de Entrega:</span>
          <p className="text-sm text-gray-600 mt-1">{work.deliveryData}</p>
        </div>
      )}

      {/* Acciones según el estado y el usuario */}
      {work.status === 0 && isWorker && (
        <button
          onClick={handleAcceptWork}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Aceptando...' : 'Aceptar Trabajo'}
        </button>
      )}

      {work.status === 1 && isWorker && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Datos de entrega (IPFS hash, URL, etc.)"
            value={deliveryData}
            onChange={(e) => setDeliveryData(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={handleSubmitWork}
            disabled={loading || !deliveryData}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Entregando...' : 'Entregar Trabajo'}
          </button>
        </div>
      )}

      {work.status === 2 && isClient && (
        <button
          onClick={handleApproveWork}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Aprobando...' : 'Aprobar y Pagar'}
        </button>
      )}

      {work.status === 3 && (
        <div className="text-center text-green-600 font-medium">
          ✅ Trabajo Completado
        </div>
      )}
    </div>
  );
};

export default WorkCard;
```

---

## 🔄 Manejo de Estados

### 1. Context de Estado Global

```javascript
// context/WorkEscrowContext.js
import React, { createContext, useContext, useReducer } from 'react';

const WorkEscrowContext = createContext();

const initialState = {
  works: [],
  loading: false,
  error: null,
  contractService: null,
  account: null,
};

const workEscrowReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_WORKS':
      return { ...state, works: action.payload };
    case 'ADD_WORK':
      return { ...state, works: [...state.works, action.payload] };
    case 'UPDATE_WORK':
      return {
        ...state,
        works: state.works.map(work =>
          work.id === action.payload.id ? action.payload : work
        ),
      };
    case 'SET_CONTRACT_SERVICE':
      return { ...state, contractService: action.payload };
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload };
    default:
      return state;
  }
};

export const WorkEscrowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workEscrowReducer, initialState);

  return (
    <WorkEscrowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkEscrowContext.Provider>
  );
};

export const useWorkEscrow = () => {
  const context = useContext(WorkEscrowContext);
  if (!context) {
    throw new Error('useWorkEscrow debe usarse dentro de WorkEscrowProvider');
  }
  return context;
};
```

### 2. Servicio de Eventos

```javascript
// services/EventService.js
export class EventService {
  constructor(contractService) {
    this.contractService = contractService;
    this.listeners = new Map();
  }

  startListening() {
    if (!this.contractService?.workEscrow) return;

    // Escuchar eventos del contrato
    this.contractService.workEscrow.on('WorkCreated', (workId, client, worker, amount, event) => {
      this.notifyListeners('WorkCreated', { workId, client, worker, amount, event });
    });

    this.contractService.workEscrow.on('WorkAccepted', (workId, worker, event) => {
      this.notifyListeners('WorkAccepted', { workId, worker, event });
    });

    this.contractService.workEscrow.on('WorkSubmitted', (workId, deliveryData, event) => {
      this.notifyListeners('WorkSubmitted', { workId, deliveryData, event });
    });

    this.contractService.workEscrow.on('WorkCompleted', (workId, event) => {
      this.notifyListeners('WorkCompleted', { workId, event });
    });
  }

  addListener(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  removeListener(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        callback(data);
      });
    }
  }

  stopListening() {
    if (this.contractService?.workEscrow) {
      this.contractService.workEscrow.removeAllListeners();
    }
  }
}
```

---

## 🧪 Testing Frontend

### 1. Configuración de Testing

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
};
```

### 2. Mock de Web3

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';

// Mock de window.ethereum
Object.defineProperty(window, 'ethereum', {
  value: {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
});

// Mock de ethers
jest.mock('ethers', () => ({
  ethers: {
    BrowserProvider: jest.fn(),
    Contract: jest.fn(),
  },
}));
```

### 3. Test de Componente

```javascript
// components/__tests__/WorkForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkForm from '../WorkForm';

const mockContractService = {
  approveUSDC: jest.fn(),
  createWork: jest.fn(),
};

describe('WorkForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    render(<WorkForm contractService={mockContractService} onWorkCreated={jest.fn()} />);
    
    expect(screen.getByLabelText('Título del Trabajo')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    expect(screen.getByLabelText('Monto (USDC)')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha Límite')).toBeInTheDocument();
  });

  it('should submit form with correct data', async () => {
    const onWorkCreated = jest.fn();
    render(<WorkForm contractService={mockContractService} onWorkCreated={onWorkCreated} />);
    
    fireEvent.change(screen.getByLabelText('Título del Trabajo'), {
      target: { value: 'Test Work' }
    });
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Test Description' }
    });
    fireEvent.change(screen.getByLabelText('Monto (USDC)'), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText('Fecha Límite'), {
      target: { value: '2024-12-31T23:59' }
    });
    
    fireEvent.click(screen.getByText('Crear Trabajo'));
    
    await waitFor(() => {
      expect(mockContractService.approveUSDC).toHaveBeenCalledWith(100);
      expect(mockContractService.createWork).toHaveBeenCalled();
    });
  });
});
```

---

## 🚀 Deploy y Producción

### 1. Build de Producción

```bash
# Next.js
npm run build
npm start

# React
npm run build
npx serve -s build

# Vue
npm run build
npx serve -s dist
```

### 2. Variables de Entorno de Producción

```env
# .env.production
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_NETWORK_ID=1
NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CHAIN_ID=0x1
```

### 3. Configuración de Redes de Producción

```javascript
// config/production.js
export const PRODUCTION_NETWORKS = {
  mainnet: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. **Error: "MetaMask no está instalado"**
```javascript
// Solución: Verificar disponibilidad de MetaMask
if (typeof window.ethereum === 'undefined') {
  alert('Por favor instala MetaMask para continuar');
  window.open('https://metamask.io/', '_blank');
}
```

#### 2. **Error: "Usuario rechazó la transacción"**
```javascript
// Solución: Manejar rechazo de transacciones
try {
  const tx = await contractService.createWork(...);
} catch (error) {
  if (error.code === 4001) {
    console.log('Usuario rechazó la transacción');
  } else {
    console.error('Error inesperado:', error);
  }
}
```

#### 3. **Error: "Red incorrecta"**
```javascript
// Solución: Verificar y cambiar red
const checkNetwork = async () => {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== '0xaa36a7') { // Sepolia
    await switchToSepolia();
  }
};
```

#### 4. **Error: "Saldo insuficiente"**
```javascript
// Solución: Verificar balance antes de transacciones
const checkBalance = async (address, amount) => {
  const balance = await contractService.getUSDCBalance(address);
  if (parseFloat(balance) < amount) {
    throw new Error('Saldo insuficiente de USDC');
  }
};
```

### Debugging

#### 1. **Logs de Debug**
```javascript
// Habilitar logs detallados
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Contract Service:', contractService);
  console.log('Current Account:', account);
  console.log('Works:', works);
}
```

#### 2. **Monitoreo de Eventos**
```javascript
// Escuchar todos los eventos del contrato
contractService.workEscrow.on('*', (event) => {
  console.log('Contract Event:', event);
});
```

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Guide](https://docs.metamask.io/guide/)
- [Web3 React Documentation](https://github.com/NoahZinsmeister/web3-react)

### Herramientas de Desarrollo
- [Remix IDE](https://remix.ethereum.org/) - Para testing de contratos
- [Hardhat Console](https://hardhat.org/hardhat-runner/docs/guides/debugging) - Para debugging
- [Etherscan](https://etherscan.io/) - Para verificar transacciones

### Comunidad
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [Discord de Hardhat](https://discord.gg/hardhat)
- [Reddit r/ethereum](https://www.reddit.com/r/ethereum/)

---

## 🎉 Conclusión

Con esta guía, tienes todo lo necesario para integrar WorkEscrow con cualquier frontend moderno. El sistema está diseñado para ser:

- **Modular**: Cada componente es independiente
- **Escalable**: Fácil de extender con nuevas funcionalidades
- **Mantenible**: Código limpio y bien documentado
- **Testeable**: Cobertura completa de tests

¡Tu aplicación WorkEscrow está lista para el mundo! 🚀
