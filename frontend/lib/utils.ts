import { formatUnits, parseUnits } from 'ethers';
import { WorkStatus, ParsedWork, Work } from '@/types';
import { USDC_DECIMALS } from '@/config/networks';
import clsx, { ClassValue } from 'clsx';

/**
 * Utility for combining class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format USDC amount from wei to human readable
 */
export function formatUSDC(amount: bigint | string): string {
  try {
    const value = typeof amount === 'string' ? BigInt(amount) : amount;
    return parseFloat(formatUnits(value, USDC_DECIMALS)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  } catch (error) {
    console.error('Error formatting USDC:', error);
    return '0.00';
  }
}

/**
 * Parse USDC amount from human readable to wei
 */
export function parseUSDC(amount: string): bigint {
  try {
    return parseUnits(amount, USDC_DECIMALS);
  } catch (error) {
    console.error('Error parsing USDC:', error);
    return BigInt(0);
  }
}

/**
 * Format ETH amount
 */
export function formatETH(amount: bigint | string): string {
  try {
    const value = typeof amount === 'string' ? BigInt(amount) : amount;
    return parseFloat(formatUnits(value, 18)).toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  } catch (error) {
    console.error('Error formatting ETH:', error);
    return '0.0000';
  }
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get work status text and color
 */
export function getWorkStatusInfo(status: WorkStatus): {
  text: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case WorkStatus.Created:
      return {
        text: 'Open',
        color: 'text-warning-700',
        bgColor: 'bg-warning-100',
      };
    case WorkStatus.InProgress:
      return {
        text: 'In Progress',
        color: 'text-primary-700',
        bgColor: 'bg-primary-100',
      };
    case WorkStatus.Submitted:
      return {
        text: 'Pending Review',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
      };
    case WorkStatus.Completed:
      return {
        text: 'Completed',
        color: 'text-success-700',
        bgColor: 'bg-success-100',
      };
    case WorkStatus.Cancelled:
      return {
        text: 'Cancelled',
        color: 'text-error-700',
        bgColor: 'bg-error-100',
      };
    default:
      return {
        text: 'Unknown',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
      };
  }
}

/**
 * Parse raw work data from contract to user-friendly format
 */
export function parseWorkData(work: Work): ParsedWork {
  const createdAt = new Date(Number(work.createdAt) * 1000);
  const deadline = work.deadline > 0 ? new Date(Number(work.deadline) * 1000) : new Date(0);
  const isExpired = deadline.getTime() > 0 && deadline.getTime() < Date.now();
  
  return {
    id: Number(work.id),
    client: work.client,
    worker: work.worker,
    amount: formatUSDC(work.amount),
    amountRaw: work.amount,
    title: work.title,
    description: work.description,
    status: work.status,
    statusText: getWorkStatusInfo(work.status).text,
    createdAt,
    deadline,
    deliveryData: work.deliveryData,
    isExpired,
  };
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate USDC amount
 */
export function isValidUSDCAmount(amount: string): boolean {
  try {
    const parsed = parseFloat(amount);
    return parsed > 0 && parsed <= 1000000 && !isNaN(parsed);
  } catch {
    return false;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Format time ago
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Format deadline relative to now
 */
export function formatDeadline(deadline: Date): {
  text: string;
  isUrgent: boolean;
  isPast: boolean;
} {
  if (deadline.getTime() === 0) {
    return { text: 'No deadline', isUrgent: false, isPast: false };
  }

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return { text: 'Overdue', isUrgent: true, isPast: true };
  }

  if (diffHours < 24) {
    return { 
      text: `${diffHours}h remaining`, 
      isUrgent: diffHours < 6, 
      isPast: false 
    };
  }

  if (diffDays < 7) {
    return { 
      text: `${diffDays}d remaining`, 
      isUrgent: diffDays <= 1, 
      isPast: false 
    };
  }

  return { 
    text: deadline.toLocaleDateString(), 
    isUrgent: false, 
    isPast: false 
  };
}

/**
 * Generate avatar URL based on address
 */
export function getAvatarUrl(address: string): string {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=3b82f6&foregroundColor=ffffff`;
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate form data
 */
export function validateWorkForm(data: {
  worker?: string;
  amount?: string;
  title?: string;
  description?: string;
  deadline?: string;
}): string[] {
  const errors: string[] = [];

  if (data.worker && !isValidAddress(data.worker)) {
    errors.push('Invalid worker address');
  }

  if (!data.amount || !isValidUSDCAmount(data.amount)) {
    errors.push('Amount must be between 0 and 1,000,000 USDC');
  }

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (data.deadline) {
    const deadlineDate = new Date(data.deadline);
    if (deadlineDate.getTime() <= Date.now()) {
      errors.push('Deadline must be in the future');
    }
  }

  return errors;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
