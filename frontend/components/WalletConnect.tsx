import { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WalletIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { truncateAddress } from '@/lib/utils';
import { SUPPORTED_NETWORKS } from '@/config/networks';
import { ENV } from '@/config/env';

interface WalletConnectProps {
  onConnected?: () => void;
}

export const WalletConnect = ({ onConnected }: WalletConnectProps) => {
  const {
    isConnected,
    account,
    chainId,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
    addNetwork,
    isConnecting,
    isLoading,
    error,
    ethBalance,
  } = useWeb3();

  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      if (onConnected) {
        onConnected();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleNetworkSwitch = async () => {
    setIsSwitchingNetwork(true);
    try {
      await switchNetwork(ENV.CHAIN_ID);
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <LoadingSpinner size="lg" text="Loading..." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <WalletIcon className="w-8 h-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <p className="text-gray-600 mt-2">
              Connect your wallet to start using WorkEscrow platform
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-error-600 mr-2" />
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleConnect}
                className="w-full"
                size="lg"
                isLoading={isConnecting}
                loadingText="Connecting..."
                leftIcon={<WalletIcon className="w-5 h-5" />}
              >
                Connect MetaMask
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>Don't have MetaMask?</p>
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Download here
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    const targetNetwork = SUPPORTED_NETWORKS[Object.keys(SUPPORTED_NETWORKS).find(
      key => SUPPORTED_NETWORKS[key].chainId === ENV.CHAIN_ID
    ) || 'sepolia'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-warning-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-warning-600" />
            </div>
            <CardTitle className="text-2xl">Wrong Network</CardTitle>
            <p className="text-gray-600 mt-2">
              Please switch to {targetNetwork?.chainName || 'the correct network'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Connected Account:</span>
                <span className="font-mono">{truncateAddress(account!)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Network:</span>
                <span>{chainId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ETH Balance:</span>
                <span>{parseFloat(ethBalance).toFixed(4)} ETH</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleNetworkSwitch}
                className="w-full"
                size="lg"
                isLoading={isSwitchingNetwork}
                loadingText="Switching..."
              >
                Switch to {targetNetwork?.chainName}
              </Button>

              <Button
                onClick={disconnect}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Disconnect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If connected and on correct network, don't render anything
  // The main app will be shown
  return null;
};
