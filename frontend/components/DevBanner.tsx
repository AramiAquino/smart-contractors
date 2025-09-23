import { isMockMode } from '@/config/development';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const DevBanner = () => {
  if (!isMockMode()) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-yellow-800">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <span className="text-sm font-medium">
          🚧 MODO DESARROLLO - Usando datos simulados (sin MetaMask ni contratos reales)
        </span>
      </div>
    </div>
  );
};
