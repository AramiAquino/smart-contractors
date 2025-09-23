import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContract } from '@/hooks/useContract';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PlusIcon, CalendarIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { isValidAddress, isValidUSDCAmount } from '@/lib/utils';
import { CreateWorkForm } from '@/types';
import toast from 'react-hot-toast';

// Form validation schema
const workFormSchema = z.object({
  worker: z.string()
    .optional()
    .refine((val) => !val || isValidAddress(val), {
      message: 'Invalid Ethereum address',
    }),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => isValidUSDCAmount(val), {
      message: 'Amount must be between 0 and 1,000,000 USDC',
    }),
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  deadline: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date.getTime() > Date.now();
    }, {
      message: 'Deadline must be in the future',
    }),
});

type WorkFormData = z.infer<typeof workFormSchema>;

interface WorkFormProps {
  onSuccess?: () => void;
}

export const WorkForm = ({ onSuccess }: WorkFormProps) => {
  const { createWork } = useContract();
  const { addWork, addNotification, setTransactionState } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<WorkFormData>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      worker: '',
      amount: '',
      title: '',
      description: '',
      deadline: '',
    },
  });

  const watchedAmount = watch('amount');

  const onSubmit: SubmitHandler<WorkFormData> = async (data) => {
    const transactionKey = 'create-work';
    
    try {
      setTransactionState(transactionKey, { isLoading: true });
      
      const formData: CreateWorkForm = {
        worker: data.worker || '0x0000000000000000000000000000000000000000',
        amount: data.amount,
        title: data.title,
        description: data.description,
        deadline: data.deadline || '',
      };

      const txHash = await createWork(formData);

      setTransactionState(transactionKey, {
        isLoading: false,
        hash: txHash,
        success: true,
      });

      addNotification({
        type: 'success',
        title: 'Work Created Successfully',
        message: `Your work "${data.title}" has been created and is now available for workers to accept.`,
        autoHide: true,
      });

      // Reset form and close
      reset();
      setIsOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }

      toast.success('Work created successfully!');
    } catch (error: any) {
      console.error('Failed to create work:', error);
      
      setTransactionState(transactionKey, {
        isLoading: false,
        error: error.message,
        success: false,
      });

      addNotification({
        type: 'error',
        title: 'Failed to Create Work',
        message: error.message || 'An unexpected error occurred while creating the work.',
        autoHide: true,
      });

      toast.error(error.message || 'Failed to create work');
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        leftIcon={<PlusIcon className="w-5 h-5" />}
        size="lg"
      >
        Create New Work
      </Button>
    );
  }

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlusIcon className="w-6 h-6 mr-2 text-primary-600" />
          Create New Work
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <Input
            label="Work Title"
            placeholder="e.g., Build a React website"
            error={errors.title?.message}
            {...register('title')}
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Describe the work requirements, deliverables, and any specific instructions..."
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <Input
              label="Payment Amount (USDC)"
              type="number"
              min="0"
              step="0.01"
              placeholder="100.00"
              error={errors.amount?.message}
              helpText="Enter the amount in USDC you want to pay for this work"
              leftIcon={<CurrencyDollarIcon className="w-5 h-5" />}
              {...register('amount')}
            />

            {/* Worker (Optional) */}
            <Input
              label="Specific Worker (Optional)"
              placeholder="0x..."
              error={errors.worker?.message}
              helpText="Leave empty to make it available to all workers"
              leftIcon={<UserIcon className="w-5 h-5" />}
              {...register('worker')}
            />
          </div>

          {/* Deadline (Optional) */}
          <Input
            label="Deadline (Optional)"
            type="datetime-local"
            error={errors.deadline?.message}
            helpText="Set a deadline for work completion"
            leftIcon={<CalendarIcon className="w-5 h-5" />}
            {...register('deadline')}
          />

          {/* Cost Summary */}
          {watchedAmount && !errors.amount && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2">Cost Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700">Work Payment:</span>
                  <span className="font-medium text-primary-900">${watchedAmount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Escrow Fee:</span>
                  <span className="font-medium text-primary-900">Free</span>
                </div>
                <hr className="border-primary-200 my-2" />
                <div className="flex justify-between">
                  <span className="font-medium text-primary-900">Total:</span>
                  <span className="font-bold text-primary-900">${watchedAmount} USDC</span>
                </div>
              </div>
              <p className="text-xs text-primary-600 mt-2">
                Funds will be held in escrow until work is completed and approved.
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating Work..."
              className="order-1 sm:order-2 flex-1"
            >
              Create Work & Deposit Funds
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
