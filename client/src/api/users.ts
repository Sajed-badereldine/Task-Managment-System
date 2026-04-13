import { api } from '@/lib/api';
import type { User } from '@/types/user';

export async function getPendingUsers() {
  const response = await api.get<User[]>('/users/pending');
  return response.data;
}

export async function approveUser(userId: string) {
  const response = await api.patch<User>(`/users/${userId}/approve`);
  return response.data;
}

export async function rejectUser(userId: string) {
  const response = await api.patch<User>(`/users/${userId}/reject`);
  return response.data;
}

export async function getAllUsers() {
  const response = await api.get<User[]>('/users');
  return response.data;
}

export async function getUserById(userId: string) {
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
}
