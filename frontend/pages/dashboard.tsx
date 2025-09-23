import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DevBanner } from '@/components/DevBanner';
import { isMockMode } from '@/config/development';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected, isCorrectNetwork, account, isLoading } = useWeb3();
  const { setUser, user } = useAppStore();

  // Update user in store when account changes (only in non-mock mode)
  useEffect(() => {
    if (!isMockMode()) {
      if (isConnected && account && isCorrectNetwork) {
        setUser({
          address: account,
          balance: '0',
          usdcBalance: '0',
          isConnected: true,
        });
      } else if (!user?.isConnected) {
        // Redirect to home if not authenticated and not in mock mode
        router.push('/');
      }
    }
  }, [isConnected, account, isCorrectNetwork, setUser, router, user?.isConnected]); // Removed user from dependencies to prevent loop

  // Show loading while checking authentication
  if (isLoading || (!isMockMode() && !user?.isConnected)) {
    return (
      <>
        <Head>
          <title>Loading... | Smart Contractors</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="xl" text="Cargando dashboard..." />
        </div>
      </>
    );
  }

  // Show wallet connect screen for non-mock mode
  if (!isMockMode() && (!isConnected || !isCorrectNetwork)) {
    return (
      <>
        <Head>
          <title>Connect Wallet | Smart Contractors</title>
          <meta name="description" content="Conecta tu wallet para acceder a la plataforma Smart Contractors" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SC</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart Contractors Dashboard</h1>
              <p className="text-gray-600">Conecta tu wallet para acceder al dashboard</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-center text-gray-600 mb-4">
                Por favor conecta tu wallet MetaMask para continuar
              </p>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | Smart Contractors</title>
        <meta name="description" content="Gestiona tus proyectos de trabajo con pagos seguros mediante contratos inteligentes" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <DevBanner />
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Smart Contractors</p>
                  <p className="text-sm text-gray-500">Plataforma de Contratación Inteligente</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a 
                  href="https://github.com/your-repo/smart-contractors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  GitHub
                </a>
                <button
                  onClick={() => router.push('/')}
                  className="hover:text-primary-600 transition-colors"
                >
                  Inicio
                </button>
                <span>v1.0.0</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
              <p>
                Built with ❤️ using Next.js, TypeScript, and Ethereum • 
                <span className="ml-1">
                  Network: {isCorrectNetwork ? 'Sepolia Testnet' : 'Unknown'}
                </span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
