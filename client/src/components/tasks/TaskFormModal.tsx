import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { Task } from '@/types/task';
import type { User } from '@/types/user';

const createSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  assignedUserId: z.string().uuid('Please select a valid user'),
});

const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

const reassignSchema = z.object({
  assignedUserId: z.string().uuid('Please select a valid user'),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;
type ReassignValues = z.infer<typeof reassignSchema>;

interface TaskFormModalProps {
  mode: 'create' | 'edit' | 'reassign';
  open: boolean;
  users: User[];
  task?: Task | null;
  isLoading?: boolean;
  onClose: () => void;
  onCreate?: (values: CreateValues) => Promise<void>;
  onEdit?: (values: EditValues) => Promise<void>;
  onReassign?: (values: ReassignValues) => Promise<void>;
}

export function TaskFormModal({
  mode,
  open,
  users,
  task,
  isLoading,
  onClose,
  onCreate,
  onEdit,
  onReassign,
}: TaskFormModalProps) {
  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedUserId: '',
    },
  });

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const reassignForm = useForm<ReassignValues>({
    resolver: zodResolver(reassignSchema),
    defaultValues: {
      assignedUserId: '',
    },
  });

  useEffect(() => {
    createForm.reset({
      title: '',
      description: '',
      assignedUserId: users[0]?.id ?? '',
    });
    editForm.reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
    });
    reassignForm.reset({
      assignedUserId: task?.assignedUser?.id ?? users[0]?.id ?? '',
    });
  }, [createForm, editForm, reassignForm, task, users]);

  if (mode === 'create') {
    return (
      <Modal
        open={open}
        title="Create Task"
        description="Assign a new task to one of your approved users."
        onClose={onClose}
      >
        <form
          className="space-y-5"
          onSubmit={createForm.handleSubmit(async (values) => {
            await onCreate?.(values);
          })}
        >
          <div>
            <label className="label">Title</label>
            <Input
              placeholder="Prepare monthly operations review"
              error={createForm.formState.errors.title?.message}
              {...createForm.register('title')}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <Textarea
              placeholder="Add the context your teammate needs to finish the task."
              error={createForm.formState.errors.description?.message}
              {...createForm.register('description')}
            />
          </div>
          <div>
            <label className="label">Assigned User</label>
            <Select
              error={createForm.formState.errors.assignedUserId?.message}
              {...createForm.register('assignedUserId')}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    );
  }

  if (mode === 'edit') {
    return (
      <Modal
        open={open}
        title="Edit Task"
        description="Update the task copy without changing backend behavior."
        onClose={onClose}
      >
        <form
          className="space-y-5"
          onSubmit={editForm.handleSubmit(async (values) => {
            await onEdit?.(values);
          })}
        >
          <div>
            <label className="label">Title</label>
            <Input
              error={editForm.formState.errors.title?.message}
              {...editForm.register('title')}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <Textarea
              error={editForm.formState.errors.description?.message}
              {...editForm.register('description')}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      title="Reassign Task"
      description="Move this task to another approved user."
      onClose={onClose}
    >
      <form
        className="space-y-5"
        onSubmit={reassignForm.handleSubmit(async (values) => {
          await onReassign?.(values);
        })}
      >
        <div>
          <label className="label">Assigned User</label>
          <Select
            error={reassignForm.formState.errors.assignedUserId?.message}
            {...reassignForm.register('assignedUserId')}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Reassign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
