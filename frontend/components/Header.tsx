import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContract } from '@/hooks/useContract';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { truncateAddress, formatETH, getAvatarUrl } from '@/lib/utils';
import { 
  WalletIcon, 
  ChevronDownIcon, 
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  PowerIcon 
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@/lib/utils';
import { ENV } from '@/config/env';

export const Header = () => {
  const router = useRouter();
  const { account, ethBalance, disconnect, chainId } = useWeb3();
  const { getUSDCBalance } = useContract();
  const { usdcBalance, setUSDCBalance, logout } = useAppStore();
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Load USDC balance on mount and account change
  useEffect(() => {
    const loadBalance = async () => {
      if (!account) return;
      
      setIsLoadingBalance(true);
      try {
        const balance = await getUSDCBalance(account);
        setUSDCBalance(balance);
      } catch (error) {
        console.error('Failed to load USDC balance:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadBalance();
  }, [account, getUSDCBalance, setUSDCBalance]);

  const handleCopyAddress = async () => {
    if (!account) return;
    
    const success = await copyToClipboard(account);
    if (success) {
      toast.success('Address copied to clipboard');
    } else {
      toast.error('Failed to copy address');
    }
  };

  const handleViewOnExplorer = () => {
    if (!account) return;
    
    const explorerUrl = `${ENV.EXPLORER_URL}/address/${account}`;
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDisconnect = () => {
    disconnect();
    logout();
    toast.success('Sesión cerrada');
    router.push('/');
  };

  if (!account) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SC</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                WorkEscrow
              </h1>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Balances */}
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium">ETH:</span>
                <span className="ml-1 font-mono">
                  {parseFloat(ethBalance).toFixed(4)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">USDC:</span>
                <span className="ml-1 font-mono">
                  {isLoadingBalance ? '...' : parseFloat(usdcBalance).toFixed(2)}
                </span>
              </div>
            </div>

            {/* User Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button as="div">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2"
                >
                  <img
                    src={getAvatarUrl(account)}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="hidden sm:block font-mono text-sm">
                    {truncateAddress(account)}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={getAvatarUrl(account)}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Connected Wallet
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {account}
                        </p>
                      </div>
                    </div>

                    {/* Balances */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ETH Balance:</span>
                        <span className="font-mono font-medium">
                          {parseFloat(ethBalance).toFixed(6)} ETH
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">USDC Balance:</span>
                        <span className="font-mono font-medium">
                          {isLoadingBalance ? 'Loading...' : `${parseFloat(usdcBalance).toFixed(6)} USDC`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Network:</span>
                        <span className="font-medium">
                          {chainId === '0xaa36a7' ? 'Sepolia' : 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleCopyAddress}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg transition-colors`}
                          >
                            <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                            Copy Address
                          </button>
                        )}
                      </Menu.Item>
                      
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleViewOnExplorer}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg transition-colors`}
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-3" />
                            View on Explorer
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleDisconnect}
                            className={`${
                              active ? 'bg-red-50 text-red-700' : 'text-red-600'
                            } flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors`}
                          >
                            <PowerIcon className="w-4 h-4 mr-3" />
                            Disconnect Wallet
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};
