// Development configuration
export const DEVELOPMENT_CONFIG = {
  // Enable mock mode for development without MetaMask
  ENABLE_MOCKS: typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true',
  
  // Mock user for testing
  MOCK_USER_ADDRESS: '0x742d35Cc6634C0532925a3b8D436F9a6fE0B8234',
  
  // Development flags
  SHOW_DEBUG_INFO: process.env.NODE_ENV === 'development',
  ENABLE_CONSOLE_LOGS: process.env.NODE_ENV === 'development',
  
  // Mock delays (in ms)
  MOCK_DELAY_SHORT: 500,
  MOCK_DELAY_MEDIUM: 1000,
  MOCK_DELAY_LONG: 2000,
};

// Helper to check if we're in mock mode (client-side only)
export const isMockMode = () => {
  if (typeof window === 'undefined') return false;
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true';
};

// Helper to log in development
export const devLog = (...args: any[]) => {
  if (DEVELOPMENT_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.log('[DEV]', ...args);
  }
};
