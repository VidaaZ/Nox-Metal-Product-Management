import bcrypt from 'bcryptjs';
import { connectToDatabase, User } from '../models/database.js';
import mongoose from 'mongoose';

const createAdminUser = async () => {
  const email = 'admin@example.com';
  const password = 'admin123';
  const role = 'admin';

  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const newAdmin = new User({
      email,
      full_name: 'Admin User',
      password: hashedPassword,
      role
    });

    await newAdmin.save();

    console.log('Admin user created successfully');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Please change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdminUser(); 