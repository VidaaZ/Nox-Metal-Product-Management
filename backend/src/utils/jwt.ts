import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthenticatedUser } from '../types/index.js';

// Use a more secure default secret and ensure it's consistent
const JWT_SECRET = process.env.JWT_SECRET || 'NoxMetalJWTSecret2024!@#';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (user: AuthenticatedUser): string => {
  const payload = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
};

export const verifyToken = (token: string): AuthenticatedUser | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Validate required fields
    if (!decoded.id || !decoded.email || !decoded.role) {
      console.error('JWT verification failed: missing required fields', decoded);
      return null;
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      full_name: decoded.full_name,
      role: decoded.role
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}; 