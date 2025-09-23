import { ParsedWork, WorkStatus } from '@/types';

// Mock user address
export const MOCK_USER_ADDRESS = '0x742d35Cc6634C0532925a3b8D436F9a6fE0B8234';
export const MOCK_OTHER_ADDRESS = '0x8ba1f109551bD432803012645Hac136c22C177e9';

// Mock work data
export const MOCK_WORKS: ParsedWork[] = [
  {
    id: 1,
    client: MOCK_USER_ADDRESS,
    worker: '0x0000000000000000000000000000000000000000',
    amount: '500.00',
    amountRaw: BigInt('500000000'),
    title: 'Build React E-commerce Website',
    description: 'Need a modern e-commerce website built with React and Next.js. Should include product catalog, shopping cart, checkout process, and admin panel. Must be responsive and SEO optimized.',
    status: WorkStatus.Created,
    statusText: 'Open',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    deliveryData: '',
    isExpired: false,
  },
  {
    id: 2,
    client: MOCK_OTHER_ADDRESS,
    worker: MOCK_USER_ADDRESS,
    amount: '250.00',
    amountRaw: BigInt('250000000'),
    title: 'Design Mobile App UI/UX',
    description: 'Create wireframes and high-fidelity designs for a fitness tracking mobile app. Need designs for 15-20 screens including onboarding, dashboard, workout tracking, and social features.',
    status: WorkStatus.InProgress,
    statusText: 'In Progress',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    deliveryData: '',
    isExpired: false,
  },
  {
    id: 3,
    client: MOCK_USER_ADDRESS,
    worker: MOCK_OTHER_ADDRESS,
    amount: '150.00',
    amountRaw: BigInt('150000000'),
    title: 'Smart Contract Audit',
    description: 'Security audit for a DeFi protocol smart contract. Need comprehensive review of the code, gas optimization suggestions, and detailed security report.',
    status: WorkStatus.Submitted,
    statusText: 'Pending Review',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    deliveryData: 'Security audit completed. Report uploaded to IPFS: QmXHGmfo7XVvTHcJVRJNbvU6VwFk8B2s8x7QjZ8nK5kL9M\n\nFindings:\n- 3 high priority issues fixed\n- 5 medium priority optimizations\n- Gas usage reduced by 15%\n\nAll tests passing. Ready for mainnet deployment.',
    isExpired: false,
  },
  {
    id: 4,
    client: MOCK_OTHER_ADDRESS,
    worker: MOCK_USER_ADDRESS,
    amount: '300.00',
    amountRaw: BigInt('300000000'),
    title: 'Content Writing - Tech Blog',
    description: 'Write 10 high-quality blog posts about blockchain technology, DeFi, and Web3 trends. Each post should be 1500-2000 words, SEO optimized, and include relevant images.',
    status: WorkStatus.Completed,
    statusText: 'Completed',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    deliveryData: 'All 10 blog posts completed and delivered:\n\n1. "The Future of DeFi: Trends to Watch in 2024"\n2. "Understanding Smart Contracts: A Beginner\'s Guide"\n3. "NFTs Beyond Art: Real-World Use Cases"\n...\n\nAll posts are published on the company blog and performing well with good SEO rankings.',
    isExpired: false,
  },
  {
    id: 5,
    client: MOCK_USER_ADDRESS,
    worker: '0x0000000000000000000000000000000000000000',
    amount: '800.00',
    amountRaw: BigInt('800000000'),
    title: 'Full-Stack Web Application',
    description: 'Develop a complete project management web application with user authentication, real-time collaboration, file uploads, and reporting features. Technology stack: React, Node.js, PostgreSQL.',
    status: WorkStatus.Created,
    statusText: 'Open',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    deliveryData: '',
    isExpired: false,
  },
  {
    id: 6,
    client: MOCK_OTHER_ADDRESS,
    worker: '0x456A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A',
    amount: '120.00',
    amountRaw: BigInt('120000000'),
    title: 'Logo Design Package',
    description: 'Create a complete brand identity package including logo design, color palette, typography guidelines, and brand guidelines document. Need modern, professional design.',
    status: WorkStatus.Cancelled,
    statusText: 'Cancelled',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    deadline: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    deliveryData: '',
    isExpired: true,
  },
  {
    id: 7,
    client: '0x789B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B',
    worker: MOCK_USER_ADDRESS,
    amount: '450.00',
    amountRaw: BigInt('450000000'),
    title: 'Mobile App Development - Flutter',
    description: 'Develop a cross-platform mobile app for expense tracking using Flutter. Features needed: expense categorization, budget tracking, charts/analytics, cloud sync.',
    status: WorkStatus.InProgress,
    statusText: 'In Progress',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    deliveryData: '',
    isExpired: false,
  },
  {
    id: 8,
    client: MOCK_USER_ADDRESS,
    worker: '0x9ABC0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C',
    amount: '200.00',
    amountRaw: BigInt('200000000'),
    title: 'SEO Optimization Service',
    description: 'Complete SEO audit and optimization for company website. Includes keyword research, on-page optimization, technical SEO fixes, and content strategy recommendations.',
    status: WorkStatus.Submitted,
    statusText: 'Pending Review',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    deliveryData: 'SEO optimization completed:\n\n✅ Technical SEO audit - 25 issues fixed\n✅ Keyword research - 150 target keywords identified\n✅ On-page optimization - All pages optimized\n✅ Site speed improved by 40%\n✅ Mobile responsiveness score: 98/100\n\nDetailed report and recommendations document attached.',
    isExpired: false,
  },
];

// Mock balances
export const MOCK_ETH_BALANCE = '1.2547';
export const MOCK_USDC_BALANCE = '2,456.78';

// Mock transaction states
export const MOCK_TRANSACTION_LOADING = {
  isLoading: false,
  success: false,
  error: '',
  hash: '',
};

// Mock network info
export const MOCK_CHAIN_ID = '0xaa36a7'; // Sepolia
export const MOCK_NETWORK_NAME = 'Sepolia Test Network';

// Helper function to get user's works
export const getUserWorks = (userAddress: string, allWorks: ParsedWork[] = MOCK_WORKS) => {
  return allWorks.filter(work => 
    work.client.toLowerCase() === userAddress.toLowerCase() ||
    work.worker.toLowerCase() === userAddress.toLowerCase()
  );
};

// Helper function to get works by status
export const getWorksByStatus = (status: WorkStatus, allWorks: ParsedWork[] = MOCK_WORKS) => {
  return allWorks.filter(work => work.status === status);
};

// Helper function to get works by role
export const getWorksByRole = (userAddress: string, role: 'client' | 'worker', allWorks: ParsedWork[] = MOCK_WORKS) => {
  if (role === 'client') {
    return allWorks.filter(work => work.client.toLowerCase() === userAddress.toLowerCase());
  } else {
    return allWorks.filter(work => work.worker.toLowerCase() === userAddress.toLowerCase());
  }
};

// Mock statistics
export const getMockStatistics = (userAddress: string) => {
  const userWorks = getUserWorks(userAddress);
  const asClient = getWorksByRole(userAddress, 'client');
  const asWorker = getWorksByRole(userAddress, 'worker');
  const completed = userWorks.filter(work => work.status === WorkStatus.Completed);
  
  const earnings = asWorker
    .filter(work => work.status === WorkStatus.Completed)
    .reduce((sum, work) => sum + parseFloat(work.amount), 0);
    
  const spent = asClient
    .filter(work => work.status === WorkStatus.Completed)
    .reduce((sum, work) => sum + parseFloat(work.amount), 0);

  return {
    totalWorks: userWorks.length,
    asClient: asClient.length,
    asWorker: asWorker.length,
    completed: completed.length,
    inProgress: userWorks.filter(work => work.status === WorkStatus.InProgress).length,
    earnings,
    spent,
  };
};
