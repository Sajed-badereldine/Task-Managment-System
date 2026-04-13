import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAllUsers } from '@/api/users';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { PageHeader } from '@/components/ui/PageHeader';
import { extractErrorMessage, formatDate } from '@/lib/utils';
import type { User } from '@/types/user';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error(extractErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadUsers();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="A full view of accounts, roles, statuses, and account creation dates."
      />
      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="The backend did not return any user records yet."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge value={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <Badge value={user.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
