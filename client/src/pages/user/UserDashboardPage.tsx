import { ArrowRight, CheckCircle2, ClipboardList, TimerReset } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyTasks } from '@/api/tasks';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';
import type { Task } from '@/types/task';

export function UserDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getMyTasks();
        setTasks(data);
      } finally {
        setIsLoading(false);
      }
    }

    void loadTasks();
  }, []);

  const doneTasks = tasks.filter((task) => task.status === 'done').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress').length;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.email}. Here is the current snapshot of your assignments.`}
        action={
          <Link to="/app/tasks">
            <Button>
              View My Tasks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />
      <div className="grid gap-5 md:grid-cols-3">
        <SummaryCard
          title="Assigned Tasks"
          value={tasks.length}
          subtitle="Everything currently assigned to you"
          icon={ClipboardList}
        />
        <SummaryCard
          title="In Progress"
          value={inProgressTasks}
          subtitle="Tasks actively being worked on"
          icon={TimerReset}
        />
        <SummaryCard
          title="Done"
          value={doneTasks}
          subtitle="Completed tasks in your queue"
          icon={CheckCircle2}
        />
      </div>
    </div>
  );
}
