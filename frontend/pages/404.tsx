import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Página No Encontrada | Smart Contractors</title>
        <meta name="description" content="La página que buscas no existe" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Página No Encontrada
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            La página que estás buscando no existe o ha sido movida. 
            ¿Te gustaría volver al inicio?
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/')}
              size="lg"
              className="w-full sm:w-auto"
              leftIcon={<HomeIcon className="w-5 h-5" />}
            >
              Volver al Inicio
            </Button>
            
            <div className="pt-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                ← Página Anterior
              </Button>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            <p>¿Crees que esto es un error? Contáctanos en support@smartcontractors.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
