import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { approveUser, getPendingUsers, rejectUser } from '@/api/users';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { PageHeader } from '@/components/ui/PageHeader';
import { extractErrorMessage } from '@/lib/utils';
import type { User } from '@/types/user';

export function PendingUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  async function loadPendingUsers() {
    try {
      const data = await getPendingUsers();
      setUsers(data);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPendingUsers();
  }, []);

  async function handleAction(userId: string, action: 'approve' | 'reject') {
    try {
      setActiveId(userId);
      if (action === 'approve') {
        await approveUser(userId);
        toast.success('User approved successfully.');
      } else {
        await rejectUser(userId);
        toast.success('User rejected successfully.');
      }
      await loadPendingUsers();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setActiveId(null);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Users"
        description="Review new signup requests and decide who should gain access."
      />
      {users.length === 0 ? (
        <EmptyState
          title="No pending users"
          description="All signup requests have already been reviewed."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {users.map((user) => (
            <Card key={user.id} className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    User Email
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{user.email}</h3>
                </div>
                <Badge value={user.status} />
              </div>
              <div className="flex items-center gap-3">
                <Badge value={user.role} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => void handleAction(user.id, 'approve')}
                  isLoading={activeId === user.id}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => void handleAction(user.id, 'reject')}
                  isLoading={activeId === user.id}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
