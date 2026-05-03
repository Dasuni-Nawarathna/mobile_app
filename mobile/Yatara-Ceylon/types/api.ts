export type UserRole = 'ADMIN' | 'STAFF' | 'USER';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number };
}

export interface PackageListItem {
  _id: string;
  title: string;
  type?: string;
  durationDays?: number;
  priceMin?: number;
  priceMax?: number;
  isPublished?: boolean;
}

export interface PackageDetail extends PackageListItem {
  description?: string;
}

export interface BookingListItem {
  _id: string;
  bookingNo?: string;
  customerName?: string;
  status?: string;
  totalAmount?: number;
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}
