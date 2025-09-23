import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    helpText,
    containerClassName,
    id,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2)}`;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200 resize-vertical',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            error && 'border-error-500 focus:ring-error-500',
            className
          )}
          rows={4}
          {...props}
        />
        
        {(error || helpText) && (
          <div className="mt-1">
            {error && (
              <p className="text-sm text-error-600">
                {error}
              </p>
            )}
            {!error && helpText && (
              <p className="text-sm text-gray-500">
                {helpText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
