import { Menu, ShieldCheck, SquareKanban } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  to: string;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Pending Users', to: '/admin/pending-users' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Tasks', to: '/admin/tasks' },
];

const userNav: NavItem[] = [
  { label: 'Dashboard', to: '/app' },
  { label: 'My Tasks', to: '/app/tasks' },
  { label: 'Profile', to: '/app/profile' },
];

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === 'admin' ? adminNav : userNav;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
        <aside
          className={cn(
            'fixed inset-y-4 left-4 z-40 flex w-[280px] flex-col rounded-[28px] border border-white/60 bg-slate-950 px-5 py-6 text-white shadow-2xl transition lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]',
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-400">
              {user?.role === 'admin' ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <SquareKanban className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-400">Workspace</p>
              <h2 className="text-lg font-extrabold">Task Manager</h2>
            </div>
          </div>

          <div className="mt-10 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white',
                    isActive && 'bg-white/10 text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Signed in as
              </p>
              <p className="mt-2 truncate text-sm font-semibold">{user?.email}</p>
              <p className="mt-1 text-xs text-slate-400">{user?.role}</p>
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full bg-white/10 text-white ring-0 hover:bg-white/20"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="panel mb-6 flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">
                Task Operations
              </p>
              <h1 className="text-lg font-extrabold text-slate-900">
                {user?.role === 'admin' ? 'Admin Control Center' : 'My Workspace'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-2xl border border-slate-200 p-3 text-slate-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden rounded-2xl bg-slate-50 px-4 py-3 text-right sm:block">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Active role
                </p>
                <p className="text-sm font-bold text-slate-900">{user?.role}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
