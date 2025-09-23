import { BrowserProvider, JsonRpcSigner, Contract, parseUnits, formatUnits } from 'ethers';
import { CreateWorkForm, ParsedWork, Work } from '@/types';
import { parseWorkData, parseUSDC } from '@/lib/utils';
import { CONTRACT_ADDRESSES, USDC_DECIMALS } from '@/config/networks';
import { ENV } from '@/config/env';

// Import ABIs
import WorkEscrowABI from '@/lib/abis/WorkEscrow.json';
import MockERC20ABI from '@/lib/abis/MockERC20.json';

export class ContractService {
  private provider: BrowserProvider;
  private signer: JsonRpcSigner;
  private workEscrowContract: Contract | null = null;
  private usdcContract: Contract | null = null;
  private chainId: string;

  constructor(provider: BrowserProvider, signer: JsonRpcSigner, chainId: string) {
    this.provider = provider;
    this.signer = signer;
    this.chainId = chainId;
    this.initializeContracts();
  }

  private initializeContracts() {
    try {
      const addresses = CONTRACT_ADDRESSES[this.chainId];
      
      if (!addresses) {
        throw new Error(`Unsupported network: ${this.chainId}`);
      }

      if (!addresses.WorkEscrow || !addresses.USDC) {
        throw new Error('Contract addresses not configured for this network');
      }

      this.workEscrowContract = new Contract(
        addresses.WorkEscrow,
        WorkEscrowABI,
        this.signer
      );

      this.usdcContract = new Contract(
        addresses.USDC,
        MockERC20ABI,
        this.signer
      );
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      throw error;
    }
  }

  // WorkEscrow Contract Methods

  /**
   * Create a new work with escrow deposit
   */
  async createWork(data: CreateWorkForm): Promise<string> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const amount = parseUSDC(data.amount);
      const deadline = data.deadline ? Math.floor(new Date(data.deadline).getTime() / 1000) : 0;
      const worker = data.worker || '0x0000000000000000000000000000000000000000';

      // First approve USDC spending
      await this.approveUSDC(data.amount);

      const tx = await this.workEscrowContract.createWork(
        worker,
        amount,
        data.title,
        data.description,
        deadline
      );

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to create work:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Accept a work (assign worker)
   */
  async acceptWork(workId: number): Promise<string> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const tx = await this.workEscrowContract.acceptWork(workId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to accept work:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Submit completed work
   */
  async submitWork(workId: number, deliveryData: string): Promise<string> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const tx = await this.workEscrowContract.submitWork(workId, deliveryData);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to submit work:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Approve work and release payment
   */
  async approveWork(workId: number): Promise<string> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const tx = await this.workEscrowContract.approveWork(workId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to approve work:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Cancel work and refund client
   */
  async cancelWork(workId: number): Promise<string> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const tx = await this.workEscrowContract.cancelWork(workId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to cancel work:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Get work details by ID
   */
  async getWork(workId: number): Promise<ParsedWork | null> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const work = await this.workEscrowContract.getWork(workId);
      return parseWorkData(work as Work);
    } catch (error: any) {
      console.error('Failed to get work:', error);
      if (error.message?.includes('Work does not exist')) {
        return null;
      }
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Get all works (with pagination for large datasets)
   */
  async getAllWorks(limit = 100): Promise<ParsedWork[]> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const nextWorkId = await this.workEscrowContract.getNextWorkId();
      const workCount = Math.min(Number(nextWorkId) - 1, limit);
      const works: ParsedWork[] = [];

      // Batch requests for better performance
      const promises: Promise<ParsedWork | null>[] = [];
      for (let i = Math.max(1, Number(nextWorkId) - workCount); i < Number(nextWorkId); i++) {
        promises.push(this.getWork(i));
      }

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          works.push(result.value);
        }
      }

      // Sort by creation date (newest first)
      return works.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error: any) {
      console.error('Failed to get all works:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Get works for a specific user (client or worker)
   */
  async getUserWorks(address: string): Promise<ParsedWork[]> {
    const allWorks = await this.getAllWorks();
    return allWorks.filter(
      work => 
        work.client.toLowerCase() === address.toLowerCase() ||
        work.worker.toLowerCase() === address.toLowerCase()
    );
  }

  /**
   * Get next work ID
   */
  async getNextWorkId(): Promise<number> {
    if (!this.workEscrowContract) throw new Error('WorkEscrow contract not initialized');

    try {
      const nextId = await this.workEscrowContract.getNextWorkId();
      return Number(nextId);
    } catch (error: any) {
      console.error('Failed to get next work ID:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  // USDC Contract Methods

  /**
   * Approve USDC spending for WorkEscrow contract
   */
  async approveUSDC(amount: string): Promise<string> {
    if (!this.usdcContract || !this.workEscrowContract) {
      throw new Error('Contracts not initialized');
    }

    try {
      const amountWei = parseUSDC(amount);
      const workEscrowAddress = await this.workEscrowContract.getAddress();
      
      const tx = await this.usdcContract.approve(workEscrowAddress, amountWei);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to approve USDC:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Get USDC balance for an address
   */
  async getUSDCBalance(address: string): Promise<string> {
    if (!this.usdcContract) throw new Error('USDC contract not initialized');

    try {
      const balance = await this.usdcContract.balanceOf(address);
      return formatUnits(balance, USDC_DECIMALS);
    } catch (error: any) {
      console.error('Failed to get USDC balance:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Get USDC allowance
   */
  async getUSDCAllowance(owner: string, spender: string): Promise<string> {
    if (!this.usdcContract) throw new Error('USDC contract not initialized');

    try {
      const allowance = await this.usdcContract.allowance(owner, spender);
      return formatUnits(allowance, USDC_DECIMALS);
    } catch (error: any) {
      console.error('Failed to get USDC allowance:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  /**
   * Mint USDC (only for testnet)
   */
  async mintUSDC(to: string, amount: string): Promise<string> {
    if (!this.usdcContract) throw new Error('USDC contract not initialized');

    try {
      const amountWei = parseUSDC(amount);
      const tx = await this.usdcContract.mint(to, amountWei);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to mint USDC:', error);
      throw new Error(this.parseContractError(error));
    }
  }

  // Event Listeners

  /**
   * Listen to WorkCreated events
   */
  onWorkCreated(callback: (event: any) => void) {
    if (!this.workEscrowContract) return;
    this.workEscrowContract.on('WorkCreated', callback);
  }

  /**
   * Listen to WorkAccepted events
   */
  onWorkAccepted(callback: (event: any) => void) {
    if (!this.workEscrowContract) return;
    this.workEscrowContract.on('WorkAccepted', callback);
  }

  /**
   * Listen to WorkSubmitted events
   */
  onWorkSubmitted(callback: (event: any) => void) {
    if (!this.workEscrowContract) return;
    this.workEscrowContract.on('WorkSubmitted', callback);
  }

  /**
   * Listen to WorkApproved events
   */
  onWorkApproved(callback: (event: any) => void) {
    if (!this.workEscrowContract) return;
    this.workEscrowContract.on('WorkApproved', callback);
  }

  /**
   * Listen to WorkCancelled events
   */
  onWorkCancelled(callback: (event: any) => void) {
    if (!this.workEscrowContract) return;
    this.workEscrowContract.on('WorkCancelled', callback);
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    if (this.workEscrowContract) {
      this.workEscrowContract.removeAllListeners();
    }
    if (this.usdcContract) {
      this.usdcContract.removeAllListeners();
    }
  }

  // Utility Methods

  /**
   * Parse contract errors to user-friendly messages
   */
  private parseContractError(error: any): string {
    if (!error.message) return 'Transaction failed';

    const message = error.message;

    // Common error patterns
    if (message.includes('user rejected transaction')) {
      return 'Transaction was rejected by user';
    }
    if (message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
    if (message.includes('Only client can perform this action')) {
      return 'Only the client can perform this action';
    }
    if (message.includes('Only assigned worker can perform this action')) {
      return 'Only the assigned worker can perform this action';
    }
    if (message.includes('Work not in required status')) {
      return 'Work is not in the correct status for this action';
    }
    if (message.includes('Work does not exist')) {
      return 'Work does not exist';
    }
    if (message.includes('Cannot cancel work in current status')) {
      return 'Work cannot be cancelled in its current status';
    }
    if (message.includes('Not the assigned worker')) {
      return 'You are not the assigned worker for this job';
    }
    if (message.includes('Client cannot be the worker')) {
      return 'The client cannot also be the worker';
    }
    if (message.includes('Amount must be greater than 0')) {
      return 'Amount must be greater than 0';
    }
    if (message.includes('Title cannot be empty')) {
      return 'Work title cannot be empty';
    }
    if (message.includes('Invalid deadline')) {
      return 'Deadline must be in the future';
    }
    if (message.includes('Delivery data cannot be empty')) {
      return 'Delivery data is required when submitting work';
    }

    // Gas estimation errors
    if (message.includes('gas required exceeds allowance') || 
        message.includes('out of gas') ||
        message.includes('gas limit reached')) {
      return 'Transaction requires more gas. Please try again with higher gas limit.';
    }

    // Network errors
    if (message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }

    // Default to original message for debugging
    return message;
  }

  /**
   * Get contract addresses for current network
   */
  getContractAddresses() {
    return CONTRACT_ADDRESSES[this.chainId];
  }

  /**
   * Check if contracts are properly initialized
   */
  isInitialized(): boolean {
    return this.workEscrowContract !== null && this.usdcContract !== null;
  }
}
