import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppStore } from '@/store/useAppStore';
import { LandingPage } from '@/components/LandingPage';
import { isMockMode } from '@/config/development';

export default function Home() {
  const router = useRouter();
  const { user } = useAppStore();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user?.isConnected) {
      router.push('/dashboard');
    }
  }, [user?.isConnected, router]); // Only depend on isConnected to prevent loops

  // Don't show landing if redirecting
  if (user?.isConnected) {
    return (
      <>
        <Head>
          <title>Loading... | Smart Contractors</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">SC</span>
            </div>
            <p className="text-gray-600">Redirigiendo a Smart Contractors...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Smart Contractors - Plataforma de Contratación Inteligente</title>
        <meta name="description" content="La primera plataforma de freelancing con pagos garantizados por blockchain. Conecta con talento global y trabaja con total confianza." />
        <meta name="keywords" content="freelancing, blockchain, trabajo digital, pagos seguros, escrow, Web3, contratos inteligentes" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Smart Contractors - Contratación Inteligente" />
        <meta property="og:description" content="Plataforma de freelancing con pagos garantizados por blockchain" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smartcontractors.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Smart Contractors - Contratación Inteligente" />
        <meta name="twitter:description" content="Plataforma de freelancing con pagos garantizados por blockchain" />
      </Head>
      
      <LandingPage />
    </>
  );
}
