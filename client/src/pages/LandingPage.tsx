import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const highlights = [
  'Approval-first onboarding for controlled team access',
  'Role-aware dashboards for admins and contributors',
  'Fast task filtering, sorting, search, and progress tracking',
];

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:28px_28px] opacity-50" />
      <div className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-brand-200/45 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent-200/45 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-400 shadow-glow">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
                Task Manager
              </p>
              <h1 className="text-xl font-extrabold text-slate-900">Operations Hub</h1>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <section>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Approval-based access for organized teams
            </p>
            <h2 className="mt-8 max-w-3xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              Run task operations with a dashboard that feels crisp, modern, and ready for real work.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Manage onboarding, approvals, assignments, and execution from one polished workspace that respects your backend exactly as it is today.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/signup">
                <Button className="w-full sm:w-auto">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-600" />
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50" />
            <div className="relative space-y-6">
              <div className="panel-muted bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Admin overview</p>
                    <h3 className="mt-2 text-3xl font-extrabold text-slate-900">52 tasks</h3>
                  </div>
                  <div className="rounded-2xl bg-brand-100 px-4 py-3 text-sm font-bold text-brand-700">
                    +12% this week
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-950 p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Users</p>
                    <p className="mt-2 text-2xl font-bold">16</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pending</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Done</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">24</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <p className="text-sm font-semibold text-slate-400">User workflow</p>
                  <p className="mt-3 text-2xl font-bold">Track my tasks</p>
                  <p className="mt-3 text-sm text-slate-300">
                    Users only see their own assignments and can update status cleanly.
                  </p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-accent-400 to-accent-500 p-6 text-white">
                  <p className="text-sm font-semibold text-white/75">Approval flow</p>
                  <p className="mt-3 text-2xl font-bold">Review pending signups</p>
                  <p className="mt-3 text-sm text-white/85">
                    Admins can approve or reject access in just a couple of clicks.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
