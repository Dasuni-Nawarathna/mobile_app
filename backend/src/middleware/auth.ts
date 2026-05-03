import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, DecodedToken } from '../utils/jwt';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'Missing authorization token',
        },
      });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'Invalid or expired token',
        },
      });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        status: 401,
        message: 'Authentication failed',
      },
    });
  }
}

/**
 * Role-based access control middleware
 * Usage: roleMiddleware('ADMIN', 'STAFF')
 */
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          status: 401,
          message: 'Authentication required',
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          status: 403,
          message: `Access denied. Required role: ${allowedRoles.join(', ')}`,
        },
      });
    }

    next();
  };
}
