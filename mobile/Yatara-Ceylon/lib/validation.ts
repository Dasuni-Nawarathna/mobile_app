const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Email is required';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email';
  return undefined;
}

export function validatePassword(value: string, min = 6): string | undefined {
  if (!value) return 'Password is required';
  if (value.length < min) return `Use at least ${min} characters`;
  return undefined;
}

export function validateRequired(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} is required`;
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Phone is required';
  if (v.replace(/\D/g, '').length < 6) return 'Enter a valid phone number';
  return undefined;
}
