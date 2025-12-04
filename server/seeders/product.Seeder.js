import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import Product from '../src/models/Product.models.js';
import Restaurant from '../src/models/Restaurant.models.js';
import Category from '../src/models/Category.models.js';
import productData from './productData.js';

dotenv.config();

const importData = async () => {
  try {
    // Check if categories exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.error('\n❌ ERROR: No categories found in database!');
      console.log('💡 Please run category seeder first:');
      console.log('   npm run seed:categories\n');
      process.exit(1);
    }

    // Check if restaurants exist
    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount === 0) {
      console.error('\n❌ ERROR: No restaurants found in database!');
      console.log('💡 Please create restaurants first.\n');
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany();
    console.log('🗑️  Existing products deleted');

    // Get all restaurants
    const restaurants = await Restaurant.find();
    const restaurantsMap = new Map();
    restaurants.forEach(rest => {
      restaurantsMap.set(rest.name.trim().toLowerCase(), rest._id);
    });

    console.log('\n🏪 Available Restaurants:');
    restaurants.forEach(rest => {
      console.log(`   - "${rest.name}" (${rest.city})`);
    });

    // Get all categories
    const categories = await Category.find();
    const categoriesMap = new Map();
    categories.forEach(cat => {
      categoriesMap.set(cat.name.trim().toLowerCase(), cat._id);
    });

    // Debug: Show available categories
    console.log('\n📋 Available Categories:');
    categories.forEach(cat => {
      console.log(`   - "${cat.name}"`);
    });
    console.log('');

    let totalProducts = 0;

    // Process each restaurant's products
    for (const restaurantData of productData) {
      const restaurantName = restaurantData.restaurantName.trim().toLowerCase();
      const restaurantId = restaurantsMap.get(restaurantName);

      if (!restaurantId) {
        console.log(`⚠️  Restaurant "${restaurantData.restaurantName}" not found. Skipping...`);
        continue;
      }

      console.log(`\n📦 Processing products for "${restaurantData.restaurantName}"...`);

      // Process each product
      for (const product of restaurantData.products) {
        const categoryName = product.categoryName.trim().toLowerCase();
        const categoryId = categoriesMap.get(categoryName);

        if (!categoryId) {
          console.log(`⚠️  Category "${product.categoryName}" not found. Skipping product "${product.name}"...`);
          continue;
        }

        // Create product
        // Stock: 1 = Available, 0 = Not Available (matches checkbox functionality)
        const isAvailable = product.available !== undefined ? product.available : true;
        await Product.create({
          restaurantId: restaurantId,
          categoryId: categoryId,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images || [],
          available: isAvailable,
          stock: isAvailable ? 1 : 0 // 1 for available, 0 for not available
        });

        totalProducts++;
        console.log(`  ✅ Added: ${product.name} - Rs. ${product.price}`);
      }
    }

    const count = await Product.countDocuments();
    console.log(`\n✅ Products Seeded Successfully!`);
    console.log(`📊 Total Products: ${count}`);
    console.log(`📊 Products Added in this run: ${totalProducts}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    const count = await Product.countDocuments();
    console.log(`❌ Products Deleted. Remaining: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting products:', error);
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

