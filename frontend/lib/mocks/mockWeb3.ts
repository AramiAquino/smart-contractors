import { MOCK_USER_ADDRESS, MOCK_ETH_BALANCE, MOCK_CHAIN_ID } from './mockData';

// Mock Web3 Provider
export const createMockWeb3Provider = () => {
  return {
    isConnected: true,
    account: MOCK_USER_ADDRESS,
    chainId: MOCK_CHAIN_ID,
    isCorrectNetwork: true,
    provider: null,
    signer: null,
    ethBalance: MOCK_ETH_BALANCE,
    connect: async () => {
      console.log('Mock: Wallet connected');
    },
    disconnect: () => {
      console.log('Mock: Wallet disconnected');
    },
    switchNetwork: async (chainId: string) => {
      console.log('Mock: Switching to network', chainId);
    },
    addNetwork: async (chainId: string) => {
      console.log('Mock: Adding network', chainId);
    },
    isConnecting: false,
    isLoading: false,
    error: null,
  };
};

// Mock window.ethereum for development
export const mockWindowEthereum = () => {
  if (typeof window !== 'undefined' && !window.ethereum) {
    (window as any).ethereum = {
      isMetaMask: true,
      request: async ({ method, params }: { method: string; params?: any[] }) => {
        console.log('Mock MetaMask request:', method, params);
        
        switch (method) {
          case 'eth_requestAccounts':
            return [MOCK_USER_ADDRESS];
          case 'eth_accounts':
            return [MOCK_USER_ADDRESS];
          case 'eth_chainId':
            return MOCK_CHAIN_ID;
          case 'wallet_switchEthereumChain':
            return null;
          case 'wallet_addEthereumChain':
            return null;
          default:
            return null;
        }
      },
      on: (event: string, handler: Function) => {
        console.log('Mock: Adding event listener for', event);
      },
      removeListener: (event: string, handler: Function) => {
        console.log('Mock: Removing event listener for', event);
      },
      removeAllListeners: () => {
        console.log('Mock: Removing all event listeners');
      },
    };
  }
};
