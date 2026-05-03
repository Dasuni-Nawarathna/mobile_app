import { apiRequest } from '@/lib/api/client';
import type { PackageDetail, Paginated, PackageListItem } from '@/types/api';

export async function listPackages(params?: { page?: number; limit?: number; search?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.search) q.set('search', params.search);
  const suffix = q.toString() ? `?${q}` : '';
  return apiRequest<Paginated<PackageListItem>>(`/api/packages${suffix}`);
}

export async function getPackage(id: string) {
  return apiRequest<PackageDetail>(`/api/packages/${encodeURIComponent(id)}`);
}
