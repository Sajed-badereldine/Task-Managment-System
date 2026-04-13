import { api } from '@/lib/api';
import type {
  AuthenticatedUser,
  LoginPayload,
  LoginResponse,
  SignupPayload,
} from '@/types/auth';
import type { User } from '@/types/user';

export async function signup(payload: SignupPayload) {
  const response = await api.post<User>('/auth/signup', payload);
  return response.data;
}

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<AuthenticatedUser>('/users/me');
  return response.data;
}
