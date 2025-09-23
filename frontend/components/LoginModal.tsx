import { useState } from 'react';
import { useRouter } from 'next/router';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store/useAppStore';
import { MOCK_USER_ADDRESS, MOCK_ETH_BALANCE, MOCK_USDC_BALANCE } from '@/lib/mocks/mockData';
import { 
  UserIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  WalletIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [loginType, setLoginType] = useState<'email' | 'wallet'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const router = useRouter();
  const { setUser } = useAppStore();

  // Mock users for demo
  const mockUsers = [
    {
      email: 'cliente@smartcontractors.com',
      password: 'demo123',
      role: 'client',
      name: 'María González',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria&backgroundColor=3b82f6'
    },
    {
      email: 'worker@smartcontractors.com', 
      password: 'demo123',
      role: 'worker',
      name: 'Carlos Rodríguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos&backgroundColor=10b981'
    },
    {
      email: 'demo@smartcontractors.com',
      password: 'demo123', 
      role: 'both',
      name: 'Usuario Demo',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=f59e0b'
    }
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = mockUsers.find(u => 
      u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Set user in global state
      setUser({
        address: MOCK_USER_ADDRESS,
        balance: MOCK_ETH_BALANCE,
        usdcBalance: MOCK_USDC_BALANCE.replace(',', ''),
        isConnected: true
      });

      toast.success(`¡Bienvenido, ${user.name}!`);
      onClose();
      router.push('/dashboard');
    } else {
      toast.error('Credenciales inválidas. Prueba: demo@smartcontractors.com / demo123');
    }

    setIsLoading(false);
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);

    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUser({
      address: MOCK_USER_ADDRESS,
      balance: MOCK_ETH_BALANCE,
      usdcBalance: MOCK_USDC_BALANCE.replace(',', ''),
      isConnected: true
    });

    toast.success('¡Wallet conectada exitosamente!');
    onClose();
    router.push('/dashboard');
    setIsLoading(false);
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      address: MOCK_USER_ADDRESS,
      balance: MOCK_ETH_BALANCE, 
      usdcBalance: MOCK_USDC_BALANCE.replace(',', ''),
      isConnected: true
    });

    toast.success('¡Acceso demo activado!');
    onClose();
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Iniciar Sesión en Smart Contractors"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Login Type Selector */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setLoginType('email')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${
              loginType === 'email'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIcon className="w-5 h-5 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setLoginType('wallet')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${
              loginType === 'wallet'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <WalletIcon className="w-5 h-5 inline mr-2" />
            Wallet
          </button>
        </div>

        {loginType === 'email' ? (
          <div>
            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Credenciales de Demo</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Email:</strong> demo@smartcontractors.com</p>
                    <p><strong>Password:</strong> demo123</p>
                    <p className="mt-2 text-xs">También puedes usar: cliente@smartcontractors.com o worker@smartcontractors.com</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="demo@smartcontractors.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                leftIcon={<UserIcon className="w-5 h-5" />}
                required
              />
              
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="demo123"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? 
                      <EyeSlashIcon className="w-5 h-5" /> : 
                      <EyeIcon className="w-5 h-5" />
                    }
                  </button>
                }
                required
              />
              
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                loadingText="Iniciando sesión..."
              >
                Iniciar Sesión
              </Button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center">
              <WalletIcon className="w-10 h-10 text-primary-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Conectar Wallet
              </h3>
              <p className="text-gray-600">
                Conecta tu wallet MetaMask o usa la demo para probar la plataforma
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleWalletConnect}
                className="w-full"
                size="lg"
                isLoading={isLoading}
                loadingText="Conectando wallet..."
                leftIcon={<WalletIcon className="w-5 h-5" />}
              >
                Conectar MetaMask (Demo)
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o</span>
                </div>
              </div>
              
              <Button
                onClick={handleQuickDemo}
                variant="outline"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                loadingText="Activando demo..."
              >
                Acceso Rápido Demo
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button 
                onClick={handleQuickDemo}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Registrarse gratis
              </button>
            </p>
            
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-700">Términos</a>
              <a href="#" className="hover:text-gray-700">Privacidad</a>
              <a href="#" className="hover:text-gray-700">Ayuda</a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
