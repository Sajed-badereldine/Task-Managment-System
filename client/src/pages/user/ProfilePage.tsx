import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your frontend profile reflects the authenticated `/users/me` response."
      />
      <Card className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Email
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Role
          </p>
          <div className="mt-3">{user?.role ? <Badge value={user.role} /> : null}</div>
        </div>
      </Card>
    </div>
  );
}
