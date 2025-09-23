export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: '0xaa36a7', // 11155111
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/your-project-id'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  localhost: {
    chainId: '0x7a69', // 31337
    chainName: 'Localhost 8545',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: [],
  },
};

export const DEFAULT_NETWORK = 'sepolia';

export const CONTRACT_ADDRESSES = {
  [SUPPORTED_NETWORKS.sepolia.chainId]: {
    WorkEscrow: process.env.NEXT_PUBLIC_WORKESCROW_ADDRESS || '',
    USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  },
  [SUPPORTED_NETWORKS.localhost.chainId]: {
    WorkEscrow: process.env.NEXT_PUBLIC_WORKESCROW_ADDRESS || '',
    USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '',
  },
};

export const USDC_DECIMALS = 6;
export const ETH_DECIMALS = 18;
