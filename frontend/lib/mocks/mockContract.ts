import { CreateWorkForm, ParsedWork } from '@/types';
import { MOCK_WORKS, MOCK_USDC_BALANCE, MOCK_USER_ADDRESS, getMockStatistics } from './mockData';

// Mock Contract Service
export const createMockContractService = () => {
  let works = [...MOCK_WORKS];
  let nextId = Math.max(...works.map(w => w.id)) + 1;

  return {
    contractService: null,
    isLoading: false,
    error: null,
    isInitialized: true,

    // Work operations
    createWork: async (data: CreateWorkForm): Promise<string> => {
      console.log('Mock: Creating work', data);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWork: ParsedWork = {
        id: nextId++,
        client: MOCK_USER_ADDRESS,
        worker: data.worker === '0x0000000000000000000000000000000000000000' 
          ? '0x0000000000000000000000000000000000000000' 
          : data.worker,
        amount: data.amount,
        amountRaw: BigInt(parseFloat(data.amount) * 1000000), // Convert to 6 decimals
        title: data.title,
        description: data.description,
        status: 0, // Created
        statusText: 'Open',
        createdAt: new Date(),
        deadline: data.deadline ? new Date(data.deadline) : new Date(0),
        deliveryData: '',
        isExpired: false,
      };
      
      works.unshift(newWork);
      
      // Mock transaction hash
      return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    },

    acceptWork: async (workId: number): Promise<string> => {
      console.log('Mock: Accepting work', workId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const workIndex = works.findIndex(w => w.id === workId);
      if (workIndex !== -1) {
        works[workIndex] = {
          ...works[workIndex],
          status: 1, // InProgress
          statusText: 'In Progress',
          worker: MOCK_USER_ADDRESS,
        };
      }
      
      return '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef';
    },

    submitWork: async (workId: number, deliveryData: string): Promise<string> => {
      console.log('Mock: Submitting work', workId, deliveryData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const workIndex = works.findIndex(w => w.id === workId);
      if (workIndex !== -1) {
        works[workIndex] = {
          ...works[workIndex],
          status: 2, // Submitted
          statusText: 'Pending Review',
          deliveryData,
        };
      }
      
      return '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef';
    },

    approveWork: async (workId: number): Promise<string> => {
      console.log('Mock: Approving work', workId);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const workIndex = works.findIndex(w => w.id === workId);
      if (workIndex !== -1) {
        works[workIndex] = {
          ...works[workIndex],
          status: 3, // Completed
          statusText: 'Completed',
        };
      }
      
      return '0x4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef';
    },

    cancelWork: async (workId: number): Promise<string> => {
      console.log('Mock: Cancelling work', workId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const workIndex = works.findIndex(w => w.id === workId);
      if (workIndex !== -1) {
        works[workIndex] = {
          ...works[workIndex],
          status: 4, // Cancelled
          statusText: 'Cancelled',
        };
      }
      
      return '0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcdef';
    },

    // Data fetching
    getWork: async (workId: number): Promise<ParsedWork | null> => {
      console.log('Mock: Getting work', workId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const work = works.find(w => w.id === workId);
      return work || null;
    },

    getAllWorks: async (): Promise<ParsedWork[]> => {
      console.log('Mock: Getting all works');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [...works];
    },

    getUserWorks: async (address: string): Promise<ParsedWork[]> => {
      console.log('Mock: Getting user works for', address);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return works.filter(work => 
        work.client.toLowerCase() === address.toLowerCase() ||
        work.worker.toLowerCase() === address.toLowerCase()
      );
    },

    getNextWorkId: async (): Promise<number> => {
      return nextId;
    },

    // USDC operations
    approveUSDC: async (amount: string): Promise<string> => {
      console.log('Mock: Approving USDC', amount);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return '0x6789012345abcdef6789012345abcdef6789012345abcdef6789012345abcdef';
    },

    getUSDCBalance: async (address: string): Promise<string> => {
      console.log('Mock: Getting USDC balance for', address);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return MOCK_USDC_BALANCE.replace(',', '');
    },

    getUSDCAllowance: async (owner: string, spender: string): Promise<string> => {
      console.log('Mock: Getting USDC allowance', owner, spender);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return '1000000.00';
    },

    mintUSDC: async (to: string, amount: string): Promise<string> => {
      console.log('Mock: Minting USDC', to, amount);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return '0x7890123456abcdef7890123456abcdef7890123456abcdef7890123456abcdef';
    },
  };
};
