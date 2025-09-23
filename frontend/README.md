# 🎨 Smart Contractors Frontend

Modern, responsive frontend for the Smart Contractors platform built with Next.js, TypeScript, and TailwindCSS.

## ✨ Features

- 🔗 **Web3 Integration** - MetaMask wallet connection with ethers.js
- 💼 **Complete Work Management** - Create, accept, submit, approve, and cancel works
- 💰 **USDC Payments** - Secure escrow payments with ERC20 tokens
- 📊 **Real-time Dashboard** - Statistics, balance tracking, and work overview
- 🔄 **Live Updates** - Contract event listeners for real-time state updates
- 📱 **Responsive Design** - Mobile-first, modern UI with excellent UX
- 🎯 **Type Safety** - Full TypeScript implementation
- 🚀 **Performance Optimized** - Code splitting, lazy loading, and caching
- 🔔 **Smart Notifications** - Toast messages and persistent notifications
- 🎨 **Beautiful UI** - Modern design system with TailwindCSS

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14.2.0** - React framework with App Router
- **React 18.3.0** - UI library with hooks and concurrent features
- **TypeScript 5.4.0** - Type safety and developer experience

### Web3 & Blockchain
- **ethers.js 6.15.0** - Ethereum library for smart contract interaction
- **@metamask/detect-provider** - MetaMask detection and integration

### Styling & UI
- **TailwindCSS 3.4.0** - Utility-first CSS framework
- **@headlessui/react 2.0.0** - Unstyled, accessible UI components
- **@heroicons/react 2.1.0** - Beautiful SVG icons

### State Management
- **Zustand 4.5.0** - Lightweight state management
- **React Hook Form 7.51.0** - Performant forms with validation
- **Zod 3.23.0** - Schema validation library

### Utils & Helpers
- **clsx** - Conditional className utility
- **date-fns** - Date manipulation library
- **react-hot-toast** - Toast notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension (for blockchain mode)
- OR use mock mode for demo without MetaMask

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your contract addresses
# NEXT_PUBLIC_WORKESCROW_ADDRESS=0x...
# NEXT_PUBLIC_USDC_ADDRESS=0x...

# For mock/demo mode without blockchain
npm run dev:mock

# Start development server
npm run dev

# Open http://localhost:3000

# OR for demo/testing without blockchain:
npm run dev:mock
# Open http://localhost:3001 (if port 3000 is busy)
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:mock     # Start with mock data (no blockchain needed)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # With coverage report
```

## 📁 Project Structure

```
frontend/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Header.tsx       # App header with wallet info
│   ├── WorkCard.tsx     # Individual work item
│   ├── WorkForm.tsx     # Create work form
│   ├── WorkList.tsx     # List of works with filters
│   └── WalletConnect.tsx # Wallet connection flow
├── config/              # Configuration files
│   ├── env.ts          # Environment variables
│   └── networks.ts     # Network configurations
├── hooks/               # Custom React hooks
│   ├── useWeb3.ts      # Web3 wallet integration
│   └── useContract.ts   # Smart contract interactions
├── lib/                # Utilities and helpers
│   ├── abis/           # Contract ABIs
│   └── utils.ts        # Helper functions
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # HTML document
│   └── index.tsx       # Home page
├── services/           # External services
│   └── ContractService.ts # Smart contract service
├── store/              # State management
│   └── useAppStore.ts  # Zustand store
├── styles/             # Global styles
│   └── globals.css     # TailwindCSS + custom styles
└── types/              # TypeScript definitions
    └── index.ts        # App-wide types
```

## 🧪 Demo Mode

Para probar la aplicación sin necesidad de MetaMask o testnet, usa el modo mock:

```bash
npm run dev:mock
```

### Credenciales de Demo:
- **Email:** demo@smartcontractors.com
- **Password:** demo123
- **Alternativos:** cliente@smartcontractors.com | worker@smartcontractors.com

### Funcionalidades en Mock:
- ✅ Navegación completa de la aplicación
- ✅ Datos de ejemplo (trabajos, balances, usuarios)  
- ✅ Estados de contratos simulados
- ✅ Flujo completo sin blockchain real

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```env
# Contract Addresses (update after deployment)
NEXT_PUBLIC_WORKESCROW_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...

# Network Configuration
NEXT_PUBLIC_NETWORK_ID=11155111
NEXT_PUBLIC_CHAIN_ID=0xaa36a7
NEXT_PUBLIC_NETWORK_NAME="Sepolia Test Network"

# RPC Configuration
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io

# App Configuration
NEXT_PUBLIC_APP_NAME="Smart Contractors"
NEXT_PUBLIC_APP_DESCRIPTION="Plataforma de Contratación Inteligente"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mock Mode (for development/demo)
NEXT_PUBLIC_ENABLE_MOCKS=true
```

### Network Support

Currently supports:
- **Sepolia Testnet** (default) - For testing with free ETH
- **Local Hardhat** - For development

To add more networks, update `config/networks.ts`.

## 💡 Key Features Explained

### 🔗 Wallet Connection
- Automatic MetaMask detection
- Network switching with user prompts
- Balance tracking (ETH and USDC)
- Persistent connection state

### 💼 Work Management
- **Create Works** - Post jobs with escrow deposits
- **Browse Works** - Filter by status, role, search terms  
- **Accept Works** - Workers can accept open jobs
- **Submit Deliverables** - Upload work completion data
- **Approve & Pay** - Clients approve and release payments
- **Cancel Works** - Clients can cancel incomplete work

### 📊 Dashboard Analytics
- Personal statistics (works posted, completed, earnings)
- Balance overview (ETH and USDC)
- Recent activity feed
- Quick actions and shortcuts

### 🔔 Notifications
- Real-time transaction updates
- Contract event notifications
- Error handling with user-friendly messages
- Toast notifications for immediate feedback

### 🎨 UI/UX Features
- **Responsive Design** - Works on all screen sizes
- **Loading States** - Skeleton loaders and spinners
- **Error Boundaries** - Graceful error handling
- **Accessibility** - WCAG compliant components
- **Dark Mode Ready** - CSS custom properties support

## 🔌 Smart Contract Integration

### Smart Contractors (WorkEscrow) Contract
- Create work with escrow deposit
- Worker assignment and progress tracking
- Delivery submission and approval flow
- Automatic payment release
- Work cancellation with refunds

### USDC Token Contract
- Balance checking and transfers
- Approval for escrow deposits
- Test token minting (testnet only)

### Event Listening
- Real-time work status updates
- Payment notifications
- Automatic UI refresh on blockchain changes

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify
```bash
# Build
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

### Self-hosted
```bash
# Build
npm run build

# Start production server
npm start
```

## 🔒 Security Considerations

- **Environment Variables** - Sensitive data in server-side only
- **Input Validation** - All user inputs validated with Zod
- **XSS Protection** - Sanitized outputs and CSP headers
- **CSRF Protection** - Built-in Next.js protection
- **Wallet Security** - No private key handling in frontend

## 🐛 Troubleshooting

### Common Issues

**MetaMask not detected:**
```javascript
// Check if MetaMask is installed
if (typeof window.ethereum === 'undefined') {
  console.error('Please install MetaMask');
}
```
*Solución: Usa `npm run dev:mock` para probar sin MetaMask*

**Wrong network:**
```javascript
// Switch to Sepolia
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xaa36a7' }],
});
```

**Transaction fails:**
- Check USDC balance
- Ensure USDC approval for Smart Contractors contract
- Verify gas limits and network fees
- For testing, use mock mode: `npm run dev:mock`

**Contract not found:**
- Verify contract addresses in `.env.local`
- Ensure contracts are deployed on current network
- Check network connection and RPC URL
- Try mock mode: `npm run dev:mock`

## 📊 Performance Optimization

- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - `npm run analyze`
- **Caching Strategy** - API responses and static assets
- **Tree Shaking** - Unused code elimination

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Run tests: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation
- Maintain responsive design

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Headless UI](https://headlessui.dev/)
- Icons from [Heroicons](https://heroicons.com/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Web3 integration with [ethers.js](https://docs.ethers.org/)

---

**🚀 Smart Contractors Frontend - Modern, Secure, Beautiful**

> 🎓 **Proyecto Universitario UNLAM 2025** - Plataforma experimental de trabajo digital usando contratos inteligentes en blockchain.
