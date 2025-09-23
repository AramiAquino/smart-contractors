import { NextPageContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialProps?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialProps, err }: ErrorProps) {
  const router = useRouter();

  const getErrorMessage = () => {
    if (statusCode === 404) {
      return 'Esta página no existe';
    }
    if (statusCode === 500) {
      return 'Error interno del servidor';
    }
    if (statusCode) {
      return `Ocurrió un error (${statusCode})`;
    }
    return err?.message || 'Ocurrió un error inesperado';
  };

  return (
    <>
      <Head>
        <title>{statusCode ? `Error ${statusCode}` : 'Error'} | Smart Contractors</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {statusCode || 'Error'}
            </h1>
            
            <p className="text-gray-600 mb-8">
              {getErrorMessage()}
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/')}
                className="w-full"
              >
                Volver al Inicio
              </Button>
              
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                Página Anterior
              </Button>
            </div>
          </div>
          
          {process.env.NODE_ENV === 'development' && err && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-red-800 mb-2">Error Details (Dev Only):</h3>
              <pre className="text-xs text-red-700 overflow-auto">
                {err.stack || err.message}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
