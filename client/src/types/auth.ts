export interface SignupPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  access_token: string;
}
