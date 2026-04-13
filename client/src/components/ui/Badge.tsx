import { cn } from '@/lib/utils';

interface BadgeProps {
  value: string;
}

export function Badge({ value }: BadgeProps) {
  const key = value.toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]',
        (key === 'pending' || key === 'todo') &&
          'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
        (key === 'approved' || key === 'done' || key === 'admin') &&
          'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
        (key === 'rejected' || key === 'danger') &&
          'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
        (key === 'in_progress' || key === 'user') &&
          'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
      )}
    >
      {value.replace('_', ' ')}
    </span>
  );
}
