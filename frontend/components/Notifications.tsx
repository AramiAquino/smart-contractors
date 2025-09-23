import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { useAppStore } from '@/store/useAppStore';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Notification } from '@/types';

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-success-600" />,
    error: <ExclamationCircleIcon className="w-5 h-5 text-error-600" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 text-warning-600" />,
    info: <InformationCircleIcon className="w-5 h-5 text-blue-600" />,
  };
  
  return icons[type] || icons.info;
};

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const { removeNotification } = useAppStore();

  const colors = {
    success: 'bg-success-50 border-success-200',
    error: 'bg-error-50 border-error-200',
    warning: 'bg-warning-50 border-warning-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-success-800',
    error: 'text-error-800',
    warning: 'text-warning-800',
    info: 'text-blue-800',
  };

  const titleColors = {
    success: 'text-success-900',
    error: 'text-error-900',
    warning: 'text-warning-900',
    info: 'text-blue-900',
  };

  return (
    <div
      className={cn(
        'w-full max-w-sm bg-white border rounded-xl shadow-lg overflow-hidden',
        colors[notification.type]
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <NotificationIcon type={notification.type} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={cn('text-sm font-medium', titleColors[notification.type])}>
              {notification.title}
            </p>
            <p className={cn('mt-1 text-sm', textColors[notification.type])}>
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={cn(
                'rounded-md inline-flex hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2',
                textColors[notification.type]
              )}
              onClick={() => removeNotification(notification.id)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Notifications = () => {
  const { notifications } = useAppStore();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Transition
            key={notification.id}
            show={true}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto">
              <NotificationCard notification={notification} />
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
};
