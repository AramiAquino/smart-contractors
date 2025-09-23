import { useState, useEffect } from 'react';
import { useContract } from '@/hooks/useContract';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAppStore, useFilteredWorks } from '@/store/useAppStore';
import { WorkCard } from '@/components/WorkCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { WorkStatus } from '@/types';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = [
  { value: WorkStatus.Created, label: 'Open', color: 'warning' as const },
  { value: WorkStatus.InProgress, label: 'In Progress', color: 'primary' as const },
  { value: WorkStatus.Submitted, label: 'Pending Review', color: 'info' as const },
  { value: WorkStatus.Completed, label: 'Completed', color: 'success' as const },
  { value: WorkStatus.Cancelled, label: 'Cancelled', color: 'error' as const },
];

const ROLE_FILTERS = [
  { value: 'all', label: 'All Works' },
  { value: 'client', label: 'My Postings' },
  { value: 'worker', label: 'My Work' },
];

export const WorkList = () => {
  const { account } = useWeb3();
  const { getAllWorks, getUserWorks } = useContract();
  const {
    works,
    setWorks,
    isLoadingWorks,
    setIsLoadingWorks,
    workFilter,
    setWorkFilter,
    addNotification,
  } = useAppStore();

  const filteredWorks = useFilteredWorks();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Load works on mount and account change
  useEffect(() => {
    loadWorks();
  }, [account]);

  const loadWorks = async (showNotification = false) => {
    if (!account) return;

    setIsLoadingWorks(true);
    
    try {
      const allWorks = await getAllWorks();
      setWorks(allWorks);
      setLastRefresh(new Date());
      
      if (showNotification) {
        addNotification({
          type: 'success',
          title: 'Works Refreshed',
          message: `Loaded ${allWorks.length} works from the blockchain.`,
          autoHide: true,
        });
      }
    } catch (error: any) {
      console.error('Failed to load works:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Load Works',
        message: error.message || 'Unable to load works from the blockchain.',
        autoHide: true,
      });
    } finally {
      setIsLoadingWorks(false);
    }
  };

  const handleRefresh = () => {
    loadWorks(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkFilter({ search: e.target.value || undefined });
  };

  const handleStatusFilter = (status: WorkStatus) => {
    const currentStatus = workFilter.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status];
    
    setWorkFilter({ status: newStatus.length > 0 ? newStatus : undefined });
  };

  const handleRoleFilter = (role: 'client' | 'worker' | 'all') => {
    setWorkFilter({ role });
  };

  const clearFilters = () => {
    setWorkFilter({ role: 'all', status: undefined, search: undefined });
  };

  const hasActiveFilters = workFilter.role !== 'all' || workFilter.status?.length || workFilter.search;

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full sm:max-w-md">
              <Input
                placeholder="Search by title or description..."
                value={workFilter.search || ''}
                onChange={handleSearchChange}
                leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                leftIcon={<ArrowPathIcon className="w-4 h-4" />}
                isLoading={isLoadingWorks}
              >
                Refresh
              </Button>
              
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Role Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLE_FILTERS.map((role) => (
                <Button
                  key={role.value}
                  onClick={() => handleRoleFilter(role.value as any)}
                  variant={workFilter.role === role.value ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {role.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FunnelIcon className="w-4 h-4 inline mr-1" />
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((status) => (
                <Badge
                  key={status.value}
                  variant={
                    workFilter.status?.includes(status.value) ? status.color : 'default'
                  }
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    workFilter.status?.includes(status.value) 
                      ? 'ring-2 ring-offset-1' 
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => handleStatusFilter(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {workFilter.role === 'client' ? 'My Postings' :
             workFilter.role === 'worker' ? 'My Work' : 'All Works'}
          </h2>
          <p className="text-sm text-gray-600">
            {isLoadingWorks ? 'Loading...' : `${filteredWorks.length} works found`}
            {lastRefresh && (
              <span className="ml-2">
                • Last updated {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Works List */}
      {isLoadingWorks ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading works..." />
        </div>
      ) : filteredWorks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          {works.length === 0 ? (
            <>
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No works found
              </h3>
              <p className="text-gray-500 mb-4">
                There are no works available yet. Create the first one!
              </p>
            </>
          ) : (
            <>
              <ExclamationTriangleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No works match your filters
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredWorks.map((work) => (
            <WorkCard 
              key={work.id} 
              work={work} 
              onUpdate={() => loadWorks()}
            />
          ))}
        </div>
      )}

      {/* Load More (for future pagination) */}
      {filteredWorks.length >= 50 && (
        <div className="text-center">
          <Button 
            onClick={() => loadWorks()}
            variant="outline"
            isLoading={isLoadingWorks}
          >
            Load More Works
          </Button>
        </div>
      )}
    </div>
  );
};
