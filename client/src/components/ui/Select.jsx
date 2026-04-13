import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Select = forwardRef(function Select(
  { className, error, children, id, ...props },
  ref,
) {
  return (
    <div className="space-y-1.5">
      <select
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error && id ? `${id}-error` : undefined}
        className={cn(
          'input appearance-none',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={id ? `${id}-error` : undefined} className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});
