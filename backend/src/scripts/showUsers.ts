import { connectToDatabase, User } from '../models/database.js';
import mongoose from 'mongoose';

const showAllUsers = async () => {
  try {
    console.log('\n🔍 Connecting to MongoDB and fetching all registered users...\n');
    
    await connectToDatabase();
    
    const users = await User.find({})
      .sort({ created_at: -1 })
      .lean();

    if (users.length === 0) {
      console.log('📭 No users found in the database.');
      console.log('💡 Try creating an admin user first: npm run create-admin');
      return;
    }

    console.log(`📊 Found ${users.length} user(s) in the database:\n`);
    
    users.forEach((user, index) => {
      console.log(`👤 User #${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Full Name: ${user.full_name || 'Not provided'}`);
      console.log(`   Role: ${user.role.toUpperCase()}`);
      console.log(`   Created: ${new Date(user.createdAt || Date.now()).toISOString()}`);
      console.log(`   Updated: ${new Date(user.updatedAt || Date.now()).toISOString()}`);
      console.log(''); // Empty line for readability
    });

    // Summary
    const adminCount = users.filter(user => user.role === 'admin').length;
    const userCount = users.filter(user => user.role === 'user').length;
    
    console.log('📈 Summary:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Regular Users: ${userCount}`);
    
    console.log('\n✅ User listing completed!');
  } catch (error) {
    console.error('❌ Error fetching users:', error);
  } finally {
    await mongoose.connection.close();
  }
};

showAllUsers();