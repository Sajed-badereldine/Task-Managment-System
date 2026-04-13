import { PencilLine, Plus, Search, Shuffle, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  createTask,
  deleteTask,
  getAllTasks,
  reassignTask,
  updateTask,
} from '@/api/tasks';
import { getAllUsers } from '@/api/users';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { extractErrorMessage, formatDate } from '@/lib/utils';
import type {
  CreateTaskPayload,
  PaginatedTaskResponse,
  ReassignTaskPayload,
  Task,
  UpdateTaskPayload,
} from '@/types/task';
import type { User } from '@/types/user';

export function AdminTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasksResponse, setTasksResponse] = useState<PaginatedTaskResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | 'reassign' | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebouncedValue(searchInput);

  const filters = useMemo(() => {
    const status = (searchParams.get('status') || undefined) as
      | 'todo'
      | 'in_progress'
      | 'done'
      | undefined;
    const assignedUserId = searchParams.get('assignedUserId') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';
    const search = searchParams.get('search') || undefined;

    return { status, assignedUserId, page, limit, sortBy, sortOrder, search };
  }, [searchParams]);

  useEffect(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (debouncedSearch) {
        next.set('search', debouncedSearch);
      } else {
        next.delete('search');
      }
      next.set('page', '1');
      return next;
    });
  }, [debouncedSearch, setSearchParams]);

  async function loadTasksAndUsers() {
    try {
      setIsLoading(true);
      const [taskData, usersData] = await Promise.all([
        getAllTasks(filters),
        getAllUsers(),
      ]);
      setTasksResponse(taskData);
      setUsers(usersData.filter((user) => user.status === 'approved'));
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTasksAndUsers();
  }, [searchParams]);

  function updateFilter(key: string, value?: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== 'page') {
        next.set('page', '1');
      }
      return next;
    });
  }

  async function handleCreate(payload: CreateTaskPayload) {
    try {
      setIsSubmitting(true);
      await createTask(payload);
      toast.success('Task created successfully.');
      setModal(null);
      await loadTasksAndUsers();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(payload: UpdateTaskPayload) {
    if (!activeTask) return;
    try {
      setIsSubmitting(true);
      await updateTask(activeTask.id, payload);
      toast.success('Task updated successfully.');
      setModal(null);
      setActiveTask(null);
      await loadTasksAndUsers();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReassign(payload: ReassignTaskPayload) {
    if (!activeTask) return;
    try {
      setIsSubmitting(true);
      await reassignTask(activeTask.id, payload);
      toast.success('Task reassigned successfully.');
      setModal(null);
      setActiveTask(null);
      await loadTasksAndUsers();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setIsSubmitting(true);
      await deleteTask(deleteTarget.id);
      toast.success('Task deleted successfully.');
      setDeleteTarget(null);
      await loadTasksAndUsers();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Create, edit, reassign, search, filter, paginate, and sort tasks using the backend query params exactly as implemented."
        action={
          <Button
            onClick={() => {
              setActiveTask(null);
              setModal('create');
            }}
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        }
      />

      <Card className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))]">
          <div>
            <label className="label">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchInput}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchInput(event.target.value)
                }
                placeholder="Search by task title"
                className="input pl-11"
              />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <Select
              value={filters.status ?? ''}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateFilter('status', event.target.value || undefined)
              }
            >
              <option value="">All statuses</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </div>
          <div>
            <label className="label">Assigned User</label>
            <Select
              value={filters.assignedUserId ?? ''}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateFilter('assignedUserId', event.target.value || undefined)
              }
            >
              <option value="">All users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="label">Page Size</label>
            <Select
              value={String(filters.limit)}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateFilter('limit', event.target.value)
              }
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
          </div>
          <div>
            <label className="label">Sort By</label>
            <Select
              value={filters.sortBy}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateFilter('sortBy', event.target.value)
              }
            >
              <option value="createdAt">Created Date</option>
            </Select>
          </div>
          <div>
            <label className="label">Sort Order</label>
            <Select
              value={filters.sortOrder}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                updateFilter('sortOrder', event.target.value)
              }
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
            </Select>
          </div>
        </div>
      </Card>

      {!tasksResponse || tasksResponse.data.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Try broadening the filters or create a new task to get started."
          action={
            <Button
              onClick={() => {
                setActiveTask(null);
                setModal('create');
              }}
            >
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4">
            {tasksResponse.data.map((task) => (
              <Card key={task.id} className="space-y-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{task.title}</h3>
                      <Badge value={task.status} />
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setActiveTask(task);
                        setModal('edit');
                      }}
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setActiveTask(task);
                        setModal('reassign');
                      }}
                    >
                      <Shuffle className="h-4 w-4" />
                      Reassign
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteTarget(task)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-slate-500 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="font-semibold text-slate-700">Assigned user:</span>{' '}
                    {task.assignedUser?.email ?? 'N/A'}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="font-semibold text-slate-700">Created:</span>{' '}
                    {formatDate(task.createdAt)}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="font-semibold text-slate-700">Task id:</span>{' '}
                    <span className="break-all">{task.id}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing page <span className="font-bold text-slate-900">{tasksResponse.page}</span>{' '}
              of <span className="font-bold text-slate-900">{tasksResponse.totalPages}</span>{' '}
              with <span className="font-bold text-slate-900">{tasksResponse.total}</span> total
              tasks.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                disabled={tasksResponse.page <= 1}
                onClick={() => updateFilter('page', String(tasksResponse.page - 1))}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                disabled={tasksResponse.page >= tasksResponse.totalPages}
                onClick={() => updateFilter('page', String(tasksResponse.page + 1))}
              >
                Next
              </Button>
            </div>
          </Card>
        </>
      )}

      <TaskFormModal
        mode="create"
        open={modal === 'create'}
        users={users}
        isLoading={isSubmitting}
        onClose={() => setModal(null)}
        onCreate={handleCreate}
      />
      <TaskFormModal
        mode="edit"
        open={modal === 'edit'}
        users={users}
        task={activeTask}
        isLoading={isSubmitting}
        onClose={() => {
          setModal(null);
          setActiveTask(null);
        }}
        onEdit={handleEdit}
      />
      <TaskFormModal
        mode="reassign"
        open={modal === 'reassign'}
        users={users}
        task={activeTask}
        isLoading={isSubmitting}
        onClose={() => {
          setModal(null);
          setActiveTask(null);
        }}
        onReassign={handleReassign}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete task?"
        description="This action will permanently remove the selected task from the system."
        confirmText="Delete Task"
        isLoading={isSubmitting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
