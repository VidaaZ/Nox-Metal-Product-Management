import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { UserInput, LoginInput, AuthenticatedUser } from '../types/index.js';

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await authService.getProfile(userId);

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    res.json({ user: authenticatedUser });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, full_name, password, role = 'user' }: UserInput = req.body;

    if (!email || !full_name || !password) {
      return res.status(400).json({ error: 'Email, full name, and password are required' });
    }

    const { user, token } = await authService.register(email, password, full_name);

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    res.status(201).json({
      message: 'User created successfully',
      user: authenticatedUser,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginInput = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { user, token } = await authService.login(email, password);

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    res.json({
      message: 'Login successful',
      user: authenticatedUser,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: any, res: Response) => {
  try {
    const users = await authService.getAllUsers();

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 