import { useState } from 'react';
import { createMockContractService } from '@/lib/mocks/mockContract';
import { isMockMode } from '@/config/development';

// Mock implementation of useContract hook
export function useContractMock() {
  const [mockService] = useState(() => createMockContractService());

  if (isMockMode()) {
    return mockService;
  }

  // If not in mock mode, this shouldn't be used
  throw new Error('useContractMock should only be used in mock mode');
}
