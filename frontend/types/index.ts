import { BigNumberish } from 'ethers';

export enum WorkStatus {
  Created = 0,
  InProgress = 1,
  Submitted = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface Work {
  id: bigint;
  client: string;
  worker: string;
  amount: bigint;
  title: string;
  description: string;
  status: WorkStatus;
  createdAt: bigint;
  deadline: bigint;
  deliveryData: string;
}

export interface ParsedWork {
  id: number;
  client: string;
  worker: string;
  amount: string; // Formatted amount (e.g., "100.50")
  amountRaw: bigint; // Raw amount in wei
  title: string;
  description: string;
  status: WorkStatus;
  statusText: string;
  createdAt: Date;
  deadline: Date;
  deliveryData: string;
  isExpired: boolean;
}

export interface CreateWorkForm {
  worker: string;
  amount: string;
  title: string;
  description: string;
  deadline: string; // ISO string
}

export interface User {
  address: string;
  balance: string;
  usdcBalance: string;
  isConnected: boolean;
}

export interface TransactionState {
  isLoading: boolean;
  hash?: string;
  error?: string;
  success?: boolean;
}

export interface ContractEvent {
  type: 'WorkCreated' | 'WorkAccepted' | 'WorkSubmitted' | 'WorkApproved' | 'WorkCancelled';
  workId: number;
  data: any;
  timestamp: number;
}

// Web3 Provider Types
export interface Web3ContextType {
  // Connection
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  isCorrectNetwork: boolean;
  
  // Balances
  ethBalance: string;
  usdcBalance: string;
  
  // Methods
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  
  // Loading states
  isConnecting: boolean;
  isLoading: boolean;
}

// Contract Service Types
export interface ContractServiceType {
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
  getNextWorkId: () => Promise<number>;
  
  // USDC operations
  approveUSDC: (amount: string) => Promise<string>;
  getUSDCBalance: (address: string) => Promise<string>;
  getUSDCAllowance: (owner: string, spender: string) => Promise<string>;
  
  // Events
  onWorkCreated: (callback: (event: any) => void) => void;
  onWorkAccepted: (callback: (event: any) => void) => void;
  onWorkSubmitted: (callback: (event: any) => void) => void;
  onWorkApproved: (callback: (event: any) => void) => void;
  onWorkCancelled: (callback: (event: any) => void) => void;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  autoHide?: boolean;
}

// Filter and sort types
export interface WorkFilter {
  status?: WorkStatus[];
  role?: 'client' | 'worker' | 'all';
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface SortOption {
  field: 'createdAt' | 'deadline' | 'amount' | 'status';
  direction: 'asc' | 'desc';
}
