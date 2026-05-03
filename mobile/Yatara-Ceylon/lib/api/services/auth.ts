import { apiRequest } from '@/lib/api/client';
import type { AuthResponse } from '@/types/api';

export async function loginRequest(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function logoutRequest(token: string) {
  return apiRequest<{ message: string }>('/api/auth/logout', {
    method: 'POST',
    token,
    body: JSON.stringify({}),
  });
}
