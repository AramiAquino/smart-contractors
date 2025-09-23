import { useState, useEffect, useMemo } from 'react';
import { ContractService } from '@/services/ContractService';
import { useWeb3 } from './useWeb3';
import { ParsedWork, CreateWorkForm } from '@/types';
import { isMockMode } from '@/config/development';
import { useContractMock } from './useContractMock';

interface UseContractReturn {
  // Contract service instance
  contractService: ContractService | null;
  
  // Loading states
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Work operations
  createWork: (data: CreateWorkForm) => Promise<string>;
  acceptWork: (workId: number) => Promise<string>;
  submitWork: (workId: number, deliveryData: string) => Promise<string>;
  approveWork: (workId: number) => Promise<string>;
  cancelWork: (workId: number) => Promise<string>;
  
  // Data fetching
  getWork: (workId: number) => Promise<ParsedWork | null>;
  getAllWorks: () => Promise<ParsedWork[]>;
  getUserWorks: (address: string) => Promise<ParsedWork[]>;
  
  // USDC operations
  approveUSDC: (amount: string) => Promise<string>;
  getUSDCBalance: (address: string) => Promise<string>;
  mintUSDC: (to: string, amount: string) => Promise<string>;
  
  // Utility methods
  isInitialized: boolean;
}

export function useContract(): UseContractReturn {
  // Use mock in development mode
  const mockContract = isMockMode() ? useContractMock() : null;
  
  if (isMockMode()) {
    return mockContract!;
  }

  const { provider, signer, chainId, isConnected, isCorrectNetwork } = useWeb3();
  const [contractService, setContractService] = useState<ContractService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize contract service when Web3 is ready
  useEffect(() => {
    const initializeContracts = async () => {
      if (!provider || !signer || !chainId || !isConnected || !isCorrectNetwork) {
        setContractService(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const service = new ContractService(provider, signer, chainId);
        setContractService(service);
      } catch (error: any) {
        console.error('Failed to initialize contract service:', error);
        setError(error.message || 'Failed to initialize contracts');
        setContractService(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeContracts();
  }, [provider, signer, chainId, isConnected, isCorrectNetwork]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (contractService) {
        contractService.removeAllListeners();
      }
    };
  }, [contractService]);

  // Memoized methods that handle errors consistently
  const wrappedMethods = useMemo(() => {
    if (!contractService) {
      const notInitialized = () => {
        throw new Error('Contract service not initialized. Please connect your wallet.');
      };

      return {
        createWork: notInitialized,
        acceptWork: notInitialized,
        submitWork: notInitialized,
        approveWork: notInitialized,
        cancelWork: notInitialized,
        getWork: notInitialized,
        getAllWorks: notInitialized,
        getUserWorks: notInitialized,
        approveUSDC: notInitialized,
        getUSDCBalance: notInitialized,
        mintUSDC: notInitialized,
      };
    }

    return {
      createWork: async (data: CreateWorkForm) => {
        setError(null);
        try {
          return await contractService.createWork(data);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      acceptWork: async (workId: number) => {
        setError(null);
        try {
          return await contractService.acceptWork(workId);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      submitWork: async (workId: number, deliveryData: string) => {
        setError(null);
        try {
          return await contractService.submitWork(workId, deliveryData);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      approveWork: async (workId: number) => {
        setError(null);
        try {
          return await contractService.approveWork(workId);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      cancelWork: async (workId: number) => {
        setError(null);
        try {
          return await contractService.cancelWork(workId);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      getWork: async (workId: number) => {
        setError(null);
        try {
          return await contractService.getWork(workId);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      getAllWorks: async () => {
        setError(null);
        try {
          return await contractService.getAllWorks();
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      getUserWorks: async (address: string) => {
        setError(null);
        try {
          return await contractService.getUserWorks(address);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      approveUSDC: async (amount: string) => {
        setError(null);
        try {
          return await contractService.approveUSDC(amount);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      getUSDCBalance: async (address: string) => {
        setError(null);
        try {
          return await contractService.getUSDCBalance(address);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },

      mintUSDC: async (to: string, amount: string) => {
        setError(null);
        try {
          return await contractService.mintUSDC(to, amount);
        } catch (error: any) {
          setError(error.message);
          throw error;
        }
      },
    };
  }, [contractService]);

  return {
    contractService,
    isLoading,
    error,
    ...wrappedMethods,
    isInitialized: contractService?.isInitialized() ?? false,
  };
}
