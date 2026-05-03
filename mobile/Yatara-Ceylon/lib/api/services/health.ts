import { apiRequest } from '@/lib/api/client';
import type { HealthResponse } from '@/types/api';

export async function healthCheck() {
  return apiRequest<HealthResponse>('/api/health');
}
