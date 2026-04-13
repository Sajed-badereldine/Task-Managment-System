import { useEffect, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import { getMyTasks, updateMyTaskStatus } from '@/api/tasks';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { extractErrorMessage, formatDate } from '@/lib/utils';
import type { Task } from '@/types/task';

export function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  async function loadTasks() {
    try {
      const data = await getMyTasks();
      setTasks(data);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function handleStatusChange(taskId: string, status: Task['status']) {
    try {
      setActiveId(taskId);
      await updateMyTaskStatus(taskId, { status });
      setTasks((current) =>
        current.map((task) => (task.id === taskId ? { ...task, status } : task)),
      );
      toast.success('Task status updated.');
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
        title="My Tasks"
        description="A focused list of tasks assigned to you. You can only update your own task status here."
      />
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks assigned"
          description="Once an admin assigns work to you, it will show up here."
        />
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">{task.title}</h3>
                    <Badge value={task.status} />
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {task.description}
                  </p>
                </div>
                <div className="w-full max-w-[220px]">
                  <label className="label">Update Status</label>
                  <Select
                    value={task.status}
                    disabled={activeId === task.id}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                      void handleStatusChange(task.id, event.target.value as Task['status'])
                    }
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 text-sm text-slate-500 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="font-semibold text-slate-700">Assigned user:</span>{' '}
                  {task.assignedUser?.email ?? 'N/A'}
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="font-semibold text-slate-700">Created:</span>{' '}
                  {formatDate(task.createdAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
