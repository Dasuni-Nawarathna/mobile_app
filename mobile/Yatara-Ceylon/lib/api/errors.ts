export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiRequestError';
  }
}

export function getErrorMessageFromBody(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return;
  const err = body as { error?: { message?: unknown } };
  const msg = err.error?.message;
  return typeof msg === 'string' ? msg : undefined;
}
