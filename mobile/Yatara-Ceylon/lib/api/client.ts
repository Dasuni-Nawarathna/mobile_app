import { getApiBaseUrl } from '@/constants/config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function parseErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'error' in body) {
    const err = (body as { error?: { message?: string } }).error;
    if (err?.message) return String(err.message);
  }
  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch (e) {
    const hint =
      e instanceof Error ? e.message : 'Network request failed';
    throw new ApiError(
      `${hint}. Check the API is running and EXPO_PUBLIC_API_URL points to ${base} (browser web cannot use wrong port).`,
      0
    );
  }

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }

  if (!res.ok) {
    const msg = parseErrorMessage(body, `Request failed (${res.status})`);
    throw new ApiError(msg, res.status);
  }

  return body as T;
}
