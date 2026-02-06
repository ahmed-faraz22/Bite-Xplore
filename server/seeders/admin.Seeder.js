import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import { User } from '../src/models/user.models.js';

dotenv.config();

const importData = async () => {
  try {
    console.log('\n🔐 Seeding Admin User...\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bitexplore.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...');
      existingAdmin.name = 'Admin';
      existingAdmin.username = 'admin';
      existingAdmin.password = 'Admin@123'; // Will be hashed by pre-save hook
      existingAdmin.role = 'admin';
      existingAdmin.status = 'active';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('✅ Admin user updated successfully');
    } else {
      // Create new admin user
      await User.create({
        name: 'Admin',
        username: 'admin',
        email: 'admin@bitexplore.com',
        password: 'Admin@123', // Will be hashed by pre-save hook
        role: 'admin',
        status: 'active',
        isVerified: true
      });
      console.log('✅ Admin user created successfully');
    }

    console.log('\n📧 Admin Credentials:');
    console.log('   Email: admin@bitexplore.com');
    console.log('   Password: Admin@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const result = await User.deleteOne({ email: 'admin@bitexplore.com' });
    if (result.deletedCount > 0) {
      console.log('✅ Admin user deleted');
    } else {
      console.log('⚠️  Admin user not found');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting admin user:', error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();

