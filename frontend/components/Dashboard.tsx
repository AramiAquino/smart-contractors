import { useState, useEffect } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContract } from '@/hooks/useContract';
import { useAppStore } from '@/store/useAppStore';
import { WorkForm } from '@/components/WorkForm';
import { WorkList } from '@/components/WorkList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { WorkStatus } from '@/types';
import {
  CurrencyDollarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { formatUSDC } from '@/lib/utils';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { account } = useWeb3();
  const { getUserWorks, getUSDCBalance, mintUSDC } = useContract();
  const { works, userWorks, setUserWorks, usdcBalance, setUSDCBalance } = useAppStore();
  
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Load user-specific data
  useEffect(() => {
    if (account) {
      loadUserData();
    }
  }, [account, works]);

  const loadUserData = async () => {
    if (!account) return;

    setIsLoadingStats(true);
    try {
      const [userWorksData, balance] = await Promise.all([
        getUserWorks(account),
        getUSDCBalance(account),
      ]);

      setUserWorks(userWorksData);
      setUSDCBalance(balance);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleMintUSDC = async () => {
    if (!account) return;

    setIsMinting(true);
    try {
      await mintUSDC(account, '1000');
      const newBalance = await getUSDCBalance(account);
      setUSDCBalance(newBalance);
      toast.success('Successfully minted 1000 USDC for testing!');
    } catch (error: any) {
      console.error('Failed to mint USDC:', error);
      toast.error(error.message || 'Failed to mint USDC');
    } finally {
      setIsMinting(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalWorks: userWorks.length,
    asClient: userWorks.filter(work => 
      work.client.toLowerCase() === account?.toLowerCase()
    ).length,
    asWorker: userWorks.filter(work => 
      work.worker.toLowerCase() === account?.toLowerCase()
    ).length,
    completed: userWorks.filter(work => work.status === WorkStatus.Completed).length,
    inProgress: userWorks.filter(work => work.status === WorkStatus.InProgress).length,
    earnings: userWorks
      .filter(work => 
        work.worker.toLowerCase() === account?.toLowerCase() && 
        work.status === WorkStatus.Completed
      )
      .reduce((sum, work) => sum + parseFloat(work.amount), 0),
    spent: userWorks
      .filter(work => 
        work.client.toLowerCase() === account?.toLowerCase() && 
        work.status === WorkStatus.Completed
      )
      .reduce((sum, work) => sum + parseFloat(work.amount), 0),
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to WorkEscrow
            </h1>
            <p className="text-primary-100 text-lg">
              Secure digital work platform powered by blockchain technology
            </p>
            <div className="flex items-center mt-4 space-x-4 text-sm">
              <div className="flex items-center">
                <BanknotesIcon className="w-5 h-5 mr-2" />
                <span>USDC Balance: {parseFloat(usdcBalance).toFixed(2)}</span>
              </div>
              {parseFloat(usdcBalance) < 100 && (
                <Button
                  onClick={handleMintUSDC}
                  isLoading={isMinting}
                  size="sm"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-700"
                >
                  Get Test USDC
                </Button>
              )}
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="lg"
              className="bg-white text-primary-700 hover:bg-gray-50"
              leftIcon={<PlusIcon className="w-5 h-5" />}
            >
              Create New Work
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      {isLoadingStats ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" text="Loading statistics..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Works</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalWorks}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">As Client</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.asClient}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">As Worker</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.asWorker}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Earnings/Spending Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-success-600" />
              Earnings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-3xl font-bold text-success-600">
                  ${stats.earnings.toFixed(2)} USDC
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Works Completed</p>
                  <p className="font-semibold">{stats.asWorker}</p>
                </div>
                <div>
                  <p className="text-gray-600">Average per Work</p>
                  <p className="font-semibold">
                    ${stats.asWorker > 0 ? (stats.earnings / stats.asWorker).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary-600" />
              Spending Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-primary-600">
                  ${stats.spent.toFixed(2)} USDC
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Works Posted</p>
                  <p className="font-semibold">{stats.asClient}</p>
                </div>
                <div>
                  <p className="text-gray-600">Average per Work</p>
                  <p className="font-semibold">
                    ${stats.asClient > 0 ? (stats.spent / stats.asClient).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Work Form */}
      {showCreateForm && (
        <div className="animate-slide-up">
          <WorkForm onSuccess={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Works List */}
      <div>
        <WorkList />
      </div>

      {/* Quick Actions */}
      {parseFloat(usdcBalance) < 10 && (
        <Card className="border-warning-200 bg-warning-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BanknotesIcon className="w-5 h-5 text-warning-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-warning-800 mb-1">
                  Low USDC Balance
                </h3>
                <p className="text-sm text-warning-700 mb-3">
                  Your USDC balance is low. Get some test USDC to create and pay for work.
                </p>
                <Button
                  onClick={handleMintUSDC}
                  isLoading={isMinting}
                  size="sm"
                  className="bg-warning-600 hover:bg-warning-700"
                >
                  Get 1000 Test USDC
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
