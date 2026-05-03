import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

// Import User model (we'll assume it exists from your web app)
// For now, mock it - you'll replace with actual model import

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function register(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Missing required fields: email, password, firstName, lastName',
        },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Password must be at least 6 characters',
        },
      });
    }

    // TODO: Check if user already exists (requires User model)
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(409).json({
    //     error: { status: 409, message: 'User already exists' }
    //   });
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Create user in database (requires User model)
    // const user = await User.create({
    //   email,
    //   password: hashedPassword,
    //   firstName,
    //   lastName,
    //   role: 'USER'
    // });

    // Mock user for now
    const user: UserData = {
      _id: 'mock-id-123',
      email,
      firstName,
      lastName,
      role: 'USER',
    };

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role as any,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Registration failed',
      },
    });
  }
}

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Email and password required',
        },
      });
    }

    // TODO: Find user in database (requires User model)
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(401).json({
    //     error: { status: 401, message: 'Invalid credentials' }
    //   });
    // }

    // Mock user for now
    const user: UserData = {
      _id: 'mock-id-123',
      email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    };

    // TODO: Compare password with hashed password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({
    //     error: { status: 401, message: 'Invalid credentials' }
    //   });
    // }

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role as any,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      error: {
        status: 500,
        message: 'Login failed',
      },
    });
  }
}

/**
 * POST /api/auth/logout
 * Logout user (client-side token deletion)
 */
export async function logout(req: Request, res: Response) {
  try {
    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: 'Logout failed',
      },
    });
  }
}
