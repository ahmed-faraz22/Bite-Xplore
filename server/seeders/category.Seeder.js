import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import Category from '../src/models/Category.models.js';
import categories from './categoryData.js';

dotenv.config();

const importData = async () => {
  try {
    console.log('\n📋 Seeding Categories...\n');

    // Delete existing categories
    const deletedCount = await Category.deleteMany();
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing categories`);

    // Insert categories with better error handling
    const insertedCategories = await Category.insertMany(categories);
    const count = await Category.countDocuments();

    console.log(`✅ Categories Seeded Successfully!`);
    console.log(`📊 Total Categories: ${count}\n`);

    // Display seeded categories
    console.log('📋 Seeded Categories:');
    insertedCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name}`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    if (error.code === 11000) {
      console.error('   Duplicate category detected. Please check categoryData.js');
    }
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const deletedCount = await Category.deleteMany();
    console.log(`✅ Categories Deleted. Deleted: ${deletedCount.deletedCount}`);
    const remaining = await Category.countDocuments();
    console.log(`   Remaining: ${remaining}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting categories:', error);
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
