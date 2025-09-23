import { useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContract } from '@/hooks/useContract';
import { useAppStore } from '@/store/useAppStore';
import { ParsedWork, WorkStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  truncateAddress, 
  getWorkStatusInfo, 
  formatTimeAgo, 
  formatDeadline, 
  getAvatarUrl 
} from '@/lib/utils';
import { 
  ClockIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ENV } from '@/config/env';

interface WorkCardProps {
  work: ParsedWork;
  onUpdate?: () => void;
}

export const WorkCard = ({ work, onUpdate }: WorkCardProps) => {
  const { account } = useWeb3();
  const { acceptWork, submitWork, approveWork, cancelWork } = useContract();
  const { updateWork, addNotification, setTransactionState } = useAppStore();
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isClient = account?.toLowerCase() === work.client.toLowerCase();
  const isWorker = account?.toLowerCase() === work.worker.toLowerCase();
  const statusInfo = getWorkStatusInfo(work.status);
  const deadlineInfo = formatDeadline(work.deadline);

  const handleAcceptWork = async () => {
    const transactionKey = `accept-work-${work.id}`;
    setIsLoading(true);
    
    try {
      setTransactionState(transactionKey, { isLoading: true });
      
      const txHash = await acceptWork(work.id);

      setTransactionState(transactionKey, {
        isLoading: false,
        hash: txHash,
        success: true,
      });

      updateWork(work.id, { 
        status: WorkStatus.InProgress,
        worker: account!,
      });

      addNotification({
        type: 'success',
        title: 'Work Accepted',
        message: `You have successfully accepted "${work.title}".`,
      });

      toast.success('Work accepted successfully!');
      onUpdate?.();
    } catch (error: any) {
      setTransactionState(transactionKey, {
        isLoading: false,
        error: error.message,
      });

      toast.error(error.message || 'Failed to accept work');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitWork = async () => {
    if (!deliveryData.trim()) {
      toast.error('Please provide delivery data');
      return;
    }

    const transactionKey = `submit-work-${work.id}`;
    setIsLoading(true);
    
    try {
      setTransactionState(transactionKey, { isLoading: true });
      
      const txHash = await submitWork(work.id, deliveryData);

      setTransactionState(transactionKey, {
        isLoading: false,
        hash: txHash,
        success: true,
      });

      updateWork(work.id, { 
        status: WorkStatus.Submitted,
        deliveryData,
      });

      addNotification({
        type: 'success',
        title: 'Work Submitted',
        message: `Your work for "${work.title}" has been submitted for review.`,
      });

      setShowSubmitModal(false);
      setDeliveryData('');
      toast.success('Work submitted successfully!');
      onUpdate?.();
    } catch (error: any) {
      setTransactionState(transactionKey, {
        isLoading: false,
        error: error.message,
      });

      toast.error(error.message || 'Failed to submit work');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveWork = async () => {
    const transactionKey = `approve-work-${work.id}`;
    setIsLoading(true);
    
    try {
      setTransactionState(transactionKey, { isLoading: true });
      
      const txHash = await approveWork(work.id);

      setTransactionState(transactionKey, {
        isLoading: false,
        hash: txHash,
        success: true,
      });

      updateWork(work.id, { status: WorkStatus.Completed });

      addNotification({
        type: 'success',
        title: 'Work Approved',
        message: `You have approved "${work.title}" and payment has been released.`,
      });

      setShowApprovalModal(false);
      toast.success('Work approved and payment released!');
      onUpdate?.();
    } catch (error: any) {
      setTransactionState(transactionKey, {
        isLoading: false,
        error: error.message,
      });

      toast.error(error.message || 'Failed to approve work');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelWork = async () => {
    if (!confirm('Are you sure you want to cancel this work? This action cannot be undone.')) {
      return;
    }

    const transactionKey = `cancel-work-${work.id}`;
    setIsLoading(true);
    
    try {
      setTransactionState(transactionKey, { isLoading: true });
      
      const txHash = await cancelWork(work.id);

      setTransactionState(transactionKey, {
        isLoading: false,
        hash: txHash,
        success: true,
      });

      updateWork(work.id, { status: WorkStatus.Cancelled });

      addNotification({
        type: 'success',
        title: 'Work Cancelled',
        message: `"${work.title}" has been cancelled and funds have been refunded.`,
      });

      toast.success('Work cancelled and funds refunded');
      onUpdate?.();
    } catch (error: any) {
      setTransactionState(transactionKey, {
        isLoading: false,
        error: error.message,
      });

      toast.error(error.message || 'Failed to cancel work');
    } finally {
      setIsLoading(false);
    }
  };

  const openEtherscan = () => {
    window.open(`${ENV.EXPLORER_URL}/address/${isClient ? work.worker : work.client}`, '_blank');
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-500">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {work.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>#{work.id}</span>
                <span>Created {formatTimeAgo(work.createdAt)}</span>
              </div>
            </div>
            <Badge
              variant={
                work.status === WorkStatus.Completed ? 'success' :
                work.status === WorkStatus.Cancelled ? 'error' :
                work.status === WorkStatus.Submitted ? 'warning' : 'primary'
              }
            >
              {statusInfo.text}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {work.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <CurrencyDollarIcon className="w-4 h-4 text-primary-600" />
              <span className="text-gray-500">Payment:</span>
              <span className="font-semibold text-primary-600">${work.amount} USDC</span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500">Client:</span>
              <div className="flex items-center space-x-1">
                <img
                  src={getAvatarUrl(work.client)}
                  alt="Client"
                  className="w-4 h-4 rounded-full"
                />
                <span className="font-mono text-xs">
                  {truncateAddress(work.client)}
                </span>
                <button
                  onClick={openEtherscan}
                  className="text-gray-400 hover:text-primary-600"
                >
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            {work.worker !== '0x0000000000000000000000000000000000000000' && (
              <div className="flex items-center space-x-2 text-sm">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Worker:</span>
                <div className="flex items-center space-x-1">
                  <img
                    src={getAvatarUrl(work.worker)}
                    alt="Worker"
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="font-mono text-xs">
                    {truncateAddress(work.worker)}
                  </span>
                </div>
              </div>
            )}

            {work.deadline.getTime() > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Deadline:</span>
                <span className={`${deadlineInfo.isUrgent ? 'text-error-600 font-medium' : ''}`}>
                  {deadlineInfo.text}
                </span>
              </div>
            )}
          </div>

          {/* Delivery Data */}
          {work.deliveryData && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <DocumentTextIcon className="w-4 h-4" />
                <span>Delivery Data:</span>
              </div>
              <p className="text-sm text-gray-600 break-words">
                {work.deliveryData}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {/* Worker can accept open work */}
            {work.status === WorkStatus.Created && !isClient && (
              <Button
                onClick={handleAcceptWork}
                size="sm"
                isLoading={isLoading}
                disabled={work.worker !== '0x0000000000000000000000000000000000000000' && !isWorker}
              >
                Accept Work
              </Button>
            )}

            {/* Worker can submit completed work */}
            {work.status === WorkStatus.InProgress && isWorker && (
              <Button
                onClick={() => setShowSubmitModal(true)}
                size="sm"
                variant="success"
              >
                Submit Work
              </Button>
            )}

            {/* Client can approve submitted work */}
            {work.status === WorkStatus.Submitted && isClient && (
              <Button
                onClick={() => setShowApprovalModal(true)}
                size="sm"
                variant="success"
                leftIcon={<CheckIcon className="w-4 h-4" />}
              >
                Approve & Pay
              </Button>
            )}

            {/* Client can cancel work in certain states */}
            {(work.status === WorkStatus.Created || work.status === WorkStatus.InProgress) && isClient && (
              <Button
                onClick={handleCancelWork}
                size="sm"
                variant="error"
                leftIcon={<XMarkIcon className="w-4 h-4" />}
              >
                Cancel Work
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Work Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Work"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please provide information about your completed work. This could include links to 
            deliverables, IPFS hashes, or descriptions of what you've delivered.
          </p>
          
          <Textarea
            label="Delivery Information"
            placeholder="e.g., GitHub repository: https://github.com/user/project, Live demo: https://mydemo.com, IPFS hash: QmXxx..."
            value={deliveryData}
            onChange={(e) => setDeliveryData(e.target.value)}
            rows={5}
          />
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitWork}
              isLoading={isLoading}
              className="flex-1"
            >
              Submit Work
            </Button>
          </div>
        </div>
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Approve Work"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Review Delivery</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Please review the work delivery before approving. Once approved, 
              payment will be immediately released to the worker.
            </p>
            {work.deliveryData && (
              <div className="bg-white rounded p-3 text-sm">
                <strong>Delivery Data:</strong>
                <p className="mt-1 break-words">{work.deliveryData}</p>
              </div>
            )}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Payment Details</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>Amount: <strong>${work.amount} USDC</strong></p>
              <p>Recipient: {truncateAddress(work.worker)}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowApprovalModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveWork}
              isLoading={isLoading}
              variant="success"
              className="flex-1"
            >
              Approve & Release Payment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
