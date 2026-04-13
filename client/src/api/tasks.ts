import { api } from '@/lib/api';
import type {
  CreateTaskPayload,
  PaginatedTaskResponse,
  ReassignTaskPayload,
  Task,
  TaskFilterDto,
  UpdateTaskPayload,
  UpdateTaskStatusPayload,
} from '@/types/task';

export async function getAllTasks(filters: TaskFilterDto) {
  const response = await api.get<PaginatedTaskResponse>('/tasks', {
    params: filters,
  });
  return response.data;
}

export async function createTask(payload: CreateTaskPayload) {
  const response = await api.post<Task>('/tasks', payload);
  return response.data;
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload) {
  const response = await api.patch<Task>(`/tasks/${taskId}`, payload);
  return response.data;
}

export async function reassignTask(taskId: string, payload: ReassignTaskPayload) {
  const response = await api.patch<Task>(`/tasks/${taskId}/reassign`, payload);
  return response.data;
}

export async function deleteTask(taskId: string) {
  const response = await api.delete<Task>(`/tasks/${taskId}`);
  return response.data;
}

export async function getMyTasks() {
  const response = await api.get<Task[]>('/tasks/my');
  return response.data;
}

export async function updateMyTaskStatus(
  taskId: string,
  payload: UpdateTaskStatusPayload,
) {
  const response = await api.patch<Task>(`/tasks/${taskId}/status`, payload);
  return response.data;
}
