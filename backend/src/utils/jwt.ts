import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment';

export type UserRole = 'ADMIN' | 'STAFF' | 'USER';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: TokenPayload): string {
  const secret = ENV.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: ENV.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
  } as any);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    const secret = ENV.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    } as any) as any;
    return decoded as DecodedToken;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 * Expected format: "Bearer <token>"
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  
  return parts[1];
}
