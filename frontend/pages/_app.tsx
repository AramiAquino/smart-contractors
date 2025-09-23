import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Notifications } from '@/components/Notifications';
import { ClientOnly } from '@/components/ClientOnly';
import { useAppStore } from '@/store/useAppStore';
import { isMockMode } from '@/config/development';
import { MOCK_USER_ADDRESS, MOCK_USDC_BALANCE, MOCK_WORKS } from '@/lib/mocks/mockData';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const { setUser, setWorks, setUSDCBalance } = useAppStore();

  // Initialize mock data on client side only (but don't auto-connect user)
  useEffect(() => {
    if (isMockMode()) {
      // Only set the data, don't auto-connect the user
      setUSDCBalance(MOCK_USDC_BALANCE.replace(',', ''));
      setWorks(MOCK_WORKS);
      // User will be set to connected only after manual login
    }
  }, [setWorks, setUSDCBalance]);

  return (
    <ClientOnly 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">SC</span>
            </div>
            <p className="text-gray-600">Cargando Smart Contractors...</p>
          </div>
        </div>
      }
    >
      <Component {...pageProps} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
        }}
      />
      <Notifications />
    </ClientOnly>
  );
}