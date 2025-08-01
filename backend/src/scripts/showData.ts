import { connectToDatabase, User, Product, AuditLog } from '../models/database.js';
import mongoose from 'mongoose';

const showAllData = async () => {
  try {
    console.log('\n🗄️ Connecting to MongoDB and fetching database contents...\n');
    
    await connectToDatabase();

    // Show Users
    const users = await User.find({}).sort({ created_at: -1 }).lean();
    console.log('👥 USERS:');
    console.log('─'.repeat(50));
    if (users.length === 0) {
      console.log('No users found');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.role.toUpperCase()}) - Created: ${new Date(user.createdAt || Date.now()).toISOString()}`);
      });
    }
    console.log('');

    // Show Products
    const products = await Product.find({}).sort({ created_at: -1 }).lean();
    console.log('📦 PRODUCTS:');
    console.log('─'.repeat(50));
    if (products.length === 0) {
      console.log('No products found');
    } else {
      products.forEach((product, index) => {
        const status = product.is_deleted ? 'DELETED' : 'ACTIVE';
        console.log(`${index + 1}. ${product.name} - $${product.price} (${status})`);
      });
    }
    console.log('');

    // Show Audit Logs
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(10).lean();
    console.log('📋 RECENT AUDIT LOGS (Last 10):');
    console.log('─'.repeat(50));
    if (logs.length === 0) {
      console.log('No audit logs found');
    } else {
      logs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.action.toUpperCase()} by ${log.user_email} - ${log.timestamp}`);
      });
    }
    console.log('');

    // Summary
    console.log('📊 SUMMARY:');
    console.log('─'.repeat(50));
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Products: ${products.length}`);
    console.log(`Total Audit Logs: ${logs.length}`);
    
    console.log('\n✅ Database inspection completed!');
  } catch (error) {
    console.error('❌ Error fetching database contents:', error);
  } finally {
    await mongoose.connection.close();
  }
};

showAllData();