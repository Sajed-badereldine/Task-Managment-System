import type { User } from '@/types/user';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assignedUser?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  assignedUserId: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
}

export interface ReassignTaskPayload {
  assignedUserId: string;
}

export interface UpdateTaskStatusPayload {
  status: 'todo' | 'in_progress' | 'done';
}

export interface TaskFilterDto {
  status?: 'todo' | 'in_progress' | 'done';
  assignedUserId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface PaginatedTaskResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
