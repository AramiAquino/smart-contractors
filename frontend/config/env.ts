// Environment configuration with fallbacks
export const ENV = {
  // Contract Addresses
  WORKESCROW_ADDRESS: process.env.NEXT_PUBLIC_WORKESCROW_ADDRESS || '',
  USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  
  // Network Configuration
  NETWORK_ID: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID || '11155111'),
  CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || '0xaa36a7',
  NETWORK_NAME: process.env.NEXT_PUBLIC_NETWORK_NAME || 'Sepolia Test Network',
  
  // RPC Configuration
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/your-project-id',
  EXPLORER_URL: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia.etherscan.io',
  
  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'WorkEscrow',
  APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Secure Digital Work Platform',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Development flags
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const;

// Validation
export const validateEnv = () => {
  const errors: string[] = [];
  
  if (!ENV.WORKESCROW_ADDRESS) {
    errors.push('NEXT_PUBLIC_WORKESCROW_ADDRESS is required');
  }
  
  if (!ENV.USDC_ADDRESS) {
    errors.push('NEXT_PUBLIC_USDC_ADDRESS is required');
  }
  
  if (errors.length > 0) {
    if (ENV.IS_DEV) {
      console.warn('Environment validation warnings:', errors);
    } else {
      throw new Error(`Environment validation failed: ${errors.join(', ')}`);
    }
  }
};

// Call validation on import
if (typeof window !== 'undefined') {
  validateEnv();
}
