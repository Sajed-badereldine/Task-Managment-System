import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' &&
          'bg-ink text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800 focus:ring-slate-300',
        variant === 'secondary' &&
          'bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 focus:ring-brand-200',
        variant === 'ghost' &&
          'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-slate-200',
        variant === 'danger' &&
          'bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700 focus:ring-rose-200',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
