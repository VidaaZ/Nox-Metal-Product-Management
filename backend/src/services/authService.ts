import bcrypt from 'bcryptjs';
import { User as UserModel } from '../models/database.js';
import { generateToken } from '../utils/jwt.js';
import { User, AuthenticatedUser } from '../types/index.js';

export class AuthService {
  async register(email: string, password: string, fullName: string): Promise<{ user: User; token: string }> {
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email: email.toLowerCase(),
      full_name: fullName,
      password: hashedPassword,
      role: 'user'
    });

    const savedUser = await newUser.save();

    const user: User = {
      _id: savedUser._id,
      email: savedUser.email,
      full_name: savedUser.full_name,
      password: savedUser.password,
      role: savedUser.role,
      created_at: (savedUser as any).createdAt || new Date(),
      updated_at: (savedUser as any).updatedAt || new Date()
    };

    const token = generateToken({
      id: savedUser._id.toString(),
      email: savedUser.email,
      full_name: savedUser.full_name,
      role: savedUser.role
    } as AuthenticatedUser);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const foundUser = await UserModel.findOne({ email: email.toLowerCase() });

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const user: User = {
      _id: foundUser._id,
      email: foundUser.email,
      full_name: foundUser.full_name,
      password: foundUser.password,
      role: foundUser.role,
      created_at: (foundUser as any).createdAt || new Date(),
      updated_at: (foundUser as any).updatedAt || new Date()
    };

    const token = generateToken({
      id: foundUser._id.toString(),
      email: foundUser.email,
      full_name: foundUser.full_name,
      role: foundUser.role
    } as AuthenticatedUser);

    return { user, token };
  }

  async getProfile(userId: string): Promise<User> {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      throw new Error('User not found');
    }

    const user: User = {
      _id: foundUser._id,
      email: foundUser.email,
      full_name: foundUser.full_name,
      password: foundUser.password,
      role: foundUser.role,
      created_at: (foundUser as any).createdAt || new Date(),
      updated_at: (foundUser as any).updatedAt || new Date()
    };

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const foundUsers = await UserModel.find({})
      .sort({ created_at: -1 })
      .lean();

    return foundUsers.map(user => ({
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      password: user.password,
      role: user.role,
      created_at: (user as any).createdAt || new Date(),
      updated_at: (user as any).updatedAt || new Date()
    }));
  }
}

export const authService = new AuthService();