import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Custom500() {
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Error del Servidor | Smart Contractors</title>
        <meta name="description" content="Ocurrió un error interno del servidor" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-red-600 mb-4">500</div>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowPathIcon className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Error del Servidor
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Algo salió mal en nuestros servidores. Nuestro equipo ha sido notificado 
            y está trabajando para solucionarlo.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={handleRefresh}
              size="lg"
              className="w-full sm:w-auto"
              leftIcon={<ArrowPathIcon className="w-5 h-5" />}
            >
              Recargar Página
            </Button>
            
            <div className="pt-2">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<HomeIcon className="w-5 h-5" />}
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            <p>
              Si el problema persiste, contáctanos en{' '}
              <a 
                href="mailto:support@smartcontractors.com" 
                className="text-primary-600 hover:text-primary-700"
              >
                support@smartcontractors.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
