import { CheckCheck, ClipboardList, Clock3, Users2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllTasks } from '@/api/tasks';
import { getAllUsers, getPendingUsers } from '@/api/users';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { PageHeader } from '@/components/ui/PageHeader';
import type { PaginatedTaskResponse } from '@/types/task';
import type { User } from '@/types/user';

export function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<PaginatedTaskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [usersData, pendingData, tasksData] = await Promise.all([
          getAllUsers(),
          getPendingUsers(),
          getAllTasks({ page: 1, limit: 100, sortBy: 'createdAt', sortOrder: 'DESC' }),
        ]);
        setUsers(usersData);
        setPendingUsers(pendingData);
        setTasks(tasksData);
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!tasks) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        description="We could not load the admin summary data right now."
      />
    );
  }

  const doneTasks = tasks.data.filter((task) => task.status === 'done').length;
  const todoTasks = tasks.data.filter((task) => task.status === 'todo').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A quick overview of your users, approvals, and task delivery status."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Users"
          value={users.length}
          subtitle="All accounts in the system"
          icon={Users2}
        />
        <SummaryCard
          title="Pending Users"
          value={pendingUsers.length}
          subtitle="Awaiting approval decision"
          icon={Clock3}
        />
        <SummaryCard
          title="Total Tasks"
          value={tasks.total}
          subtitle="Across the current task board"
          icon={ClipboardList}
        />
        <SummaryCard
          title="Done Tasks"
          value={doneTasks}
          subtitle="Completed in the current result set"
          icon={CheckCheck}
        />
        <SummaryCard
          title="Todo Tasks"
          value={todoTasks}
          subtitle="Ready to be started"
          icon={ClipboardList}
        />
      </div>
    </div>
  );
}
