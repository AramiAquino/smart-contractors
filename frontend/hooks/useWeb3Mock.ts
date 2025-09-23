import { useState, useEffect } from 'react';
import { createMockWeb3Provider, mockWindowEthereum } from '@/lib/mocks/mockWeb3';
import { isMockMode } from '@/config/development';

// Mock implementation of useWeb3 hook
export function useWeb3Mock() {
  const [mockProvider] = useState(() => createMockWeb3Provider());

  useEffect(() => {
    if (isMockMode()) {
      // Initialize mock window.ethereum
      mockWindowEthereum();
    }
  }, []);

  if (isMockMode()) {
    return mockProvider;
  }

  // If not in mock mode, this shouldn't be used
  throw new Error('useWeb3Mock should only be used in mock mode');
}
