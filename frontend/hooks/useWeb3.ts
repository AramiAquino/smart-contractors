import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner, formatUnits } from 'ethers';
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK } from '@/config/networks';
import { ENV } from '@/config/env';
import { isMockMode } from '@/config/development';
import { useWeb3Mock } from './useWeb3Mock';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface UseWeb3Return {
  // Connection state
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  isCorrectNetwork: boolean;
  
  // Provider and signer
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  
  // Balances
  ethBalance: string;
  
  // Methods
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  addNetwork: (chainId: string) => Promise<void>;
  
  // Loading states
  isConnecting: boolean;
  isLoading: boolean;
  
  // Error state
  error: string | null;
}

export function useWeb3(): UseWeb3Return {
  // Use mock in development mode
  const mockWeb3 = isMockMode() ? useWeb3Mock() : null;
  
  if (isMockMode()) {
    return mockWeb3!;
  }

  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we're on the correct network
  const isCorrectNetwork = chainId === ENV.CHAIN_ID;

  // Initialize provider and check connection
  const initializeProvider = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setIsLoading(false);
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      setProvider(provider);

      // Check if already connected
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        
        setAccount(accounts[0]);
        setChainId(chainId);
        setIsConnected(true);

        const signer = await provider.getSigner();
        setSigner(signer);
        
        // Load balance
        await loadBalance(provider, accounts[0]);
      }
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      setError('Failed to initialize Web3 provider');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load ETH balance
  const loadBalance = useCallback(async (provider: BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address);
      setEthBalance(formatUnits(balance, 18));
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!provider) {
      setError('MetaMask is not installed. Please install MetaMask and try again.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      setAccount(accounts[0]);
      setChainId(chainId);
      setIsConnected(true);

      const signer = await provider.getSigner();
      setSigner(signer);

      await loadBalance(provider, accounts[0]);

      // Auto-switch to correct network if needed
      if (chainId !== ENV.CHAIN_ID) {
        try {
          await switchNetwork(ENV.CHAIN_ID);
        } catch (switchError) {
          console.warn('Failed to auto-switch network:', switchError);
        }
      }
    } catch (error: any) {
      console.error('Connection failed:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [provider, loadBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setSigner(null);
    setEthBalance('0');
    setError(null);
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId: string) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (error: any) {
      // If network doesn't exist, try to add it
      if (error.code === 4902) {
        await addNetwork(targetChainId);
      } else {
        throw error;
      }
    }
  }, []);

  // Add network to MetaMask
  const addNetwork = useCallback(async (targetChainId: string) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const network = Object.values(SUPPORTED_NETWORKS).find(
      net => net.chainId === targetChainId
    );

    if (!network) {
      throw new Error('Unsupported network');
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [network],
    });
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        if (provider) {
          loadBalance(provider, accounts[0]);
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(chainId);
      // Reload the page to avoid any issues with chain switching
      window.location.reload();
    };

    const handleConnect = () => {
      initializeProvider();
    };

    const handleDisconnect = () => {
      disconnect();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [account, provider, disconnect, initializeProvider, loadBalance]);

  // Initialize on mount
  useEffect(() => {
    initializeProvider();
  }, [initializeProvider]);

  return {
    // Connection state
    isConnected,
    account,
    chainId,
    isCorrectNetwork,
    
    // Provider and signer
    provider,
    signer,
    
    // Balances
    ethBalance,
    
    // Methods
    connect,
    disconnect,
    switchNetwork,
    addNetwork,
    
    // Loading states
    isConnecting,
    isLoading,
    
    // Error state
    error,
  };
}
