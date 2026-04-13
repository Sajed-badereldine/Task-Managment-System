import type { PropsWithChildren } from 'react';

export function PublicAuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-grid bg-[size:26px_26px] opacity-50" />
      <div className="absolute left-[-10%] top-[-15%] h-[380px] w-[380px] rounded-full bg-brand-200/45 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[360px] w-[360px] rounded-full bg-accent-200/40 blur-3xl" />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
