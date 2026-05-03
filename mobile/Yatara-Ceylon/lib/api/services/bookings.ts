import { apiRequest } from '@/lib/api/client';
import type { BookingListItem, Paginated } from '@/types/api';

export async function listBookings(token: string, params?: { page?: number; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const suffix = q.toString() ? `?${q}` : '';
  return apiRequest<Paginated<BookingListItem>>(`/api/bookings${suffix}`, {
    method: 'GET',
    token,
  });
}

export async function createBooking(
  token: string,
  body: {
    customerName: string;
    email: string;
    phone: string;
    packageId: string;
    dates: { from: string; to: string };
    notes?: string;
  }
) {
  return apiRequest<{ message: string; booking: BookingListItem }>('/api/bookings', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}
