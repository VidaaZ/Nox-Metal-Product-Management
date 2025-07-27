import bcrypt from 'bcryptjs';
import { db } from '../models/database.js';

const createAdminUser = async () => {
  const email = 'admin@example.com';
  const password = 'admin123';
  const role = 'admin';

  try {
    // Check if admin already exists
    const existingAdmin = await new Promise<any>((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    await new Promise<void>((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role],
        function (err) {
          if (err) reject(err);
          else {
            console.log('Admin user created successfully');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            console.log('Please change the password after first login!');
            resolve();
          }
        }
      );
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    db.close();
  }
};

createAdminUser(); 