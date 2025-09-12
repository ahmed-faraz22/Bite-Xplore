import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import Category from '../src/models/Category.models.js';
import categories from './categoryData.js';

dotenv.config();

const importData = async () => {
  try {
    await Category.deleteMany();
    await Category.insertMany(categories);
    const count = await Category.countDocuments();
    console.log(`✅ Categories Seeded: ${count} documents`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    const count = await Category.countDocuments();
    console.log(`❌ Categories Deleted. Remaining: ${count}`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB(); // ✅ use shared connection
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();
