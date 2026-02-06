import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import Product from '../src/models/Product.models.js';
import Restaurant from '../src/models/Restaurant.models.js';
import Category from '../src/models/Category.models.js';
import productData from './productData.js';

dotenv.config();

const importData = async () => {
  try {
    console.log('\n📦 Starting Product Seeding Process...\n');

    // Validate prerequisites
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.error('❌ ERROR: No categories found in database!');
      console.log('💡 Please run category seeder first:');
      console.log('   npm run seed:categories\n');
      process.exit(1);
    }

    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount === 0) {
      console.error('❌ ERROR: No restaurants found in database!');
      console.log('💡 Please create restaurant profiles first.\n');
      process.exit(1);
    }

    // Clear existing products
    const deletedCount = await Product.deleteMany();
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing products`);

    // Get all restaurants
    const restaurants = await Restaurant.find();
    console.log(`\n🏪 Found ${restaurants.length} restaurant(s) in database:`);
    restaurants.forEach((rest, index) => {
      console.log(`   ${index + 1}. "${rest.name}" (${rest.city || 'N/A'})`);
    });

    // Get all categories and create a map for quick lookup
    const categories = await Category.find();
    const categoriesMap = new Map();
    categories.forEach(cat => {
      categoriesMap.set(cat.name.trim().toLowerCase(), cat._id);
    });

    console.log(`\n📋 Found ${categories.length} category/categories in database:\n`);

    // Collect all unique products from productData
    const allProducts = [];
    const seenProducts = new Set();

    for (const restaurantData of productData) {
      for (const product of restaurantData.products) {
        const productKey = `${product.name.toLowerCase()}_${product.categoryName.toLowerCase()}`;
        
        if (!seenProducts.has(productKey)) {
          seenProducts.add(productKey);
          allProducts.push(product);
        }
      }
    }

    console.log(`📦 Found ${allProducts.length} unique product(s) to seed:\n`);
    allProducts.forEach((prod, index) => {
      console.log(`   ${index + 1}. ${prod.name} (${prod.categoryName}) - Rs. ${prod.price}`);
    });
    console.log('');

    let totalProductsCreated = 0;
    let skippedProducts = 0;
    const errors = [];

    // Shuffle products for random distribution
    const shuffledProducts = [...allProducts].sort(() => Math.random() - 0.5);
    
    // Keep some common products that most restaurants will have (first 4: Burger, Fries, Pizza, Coke)
    const commonProductNames = ['Classic Burger', 'French Fries', 'Margherita Pizza', 'Coca Cola'];
    const commonProducts = allProducts.filter(p => 
      commonProductNames.includes(p.name)
    );
    const uniqueProducts = allProducts.filter(p => 
      !commonProductNames.includes(p.name)
    );

    // Distribute unique products across restaurants
    // Each restaurant gets: 4 common products + 10-12 unique products
    const productsPerRestaurant = Math.ceil(uniqueProducts.length / restaurants.length);
    const targetProductsPerRestaurant = Math.min(12, productsPerRestaurant);

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      console.log(`\n📦 Processing products for "${restaurant.name}"...`);
      let restaurantProductCount = 0;

      // Calculate which unique products to assign to this restaurant
      const startIndex = i * targetProductsPerRestaurant;
      const endIndex = Math.min(startIndex + targetProductsPerRestaurant, uniqueProducts.length);
      const restaurantUniqueProducts = uniqueProducts.slice(startIndex, endIndex);
      
      // Combine common products + unique products for this restaurant
      const allRestaurantProducts = [...commonProducts, ...restaurantUniqueProducts];
      
      // Shuffle to avoid predictable order
      const finalProducts = allRestaurantProducts.sort(() => Math.random() - 0.5);

      // Create products for this restaurant
      for (const product of finalProducts) {
        try {
          const categoryName = product.categoryName.trim().toLowerCase();
          const categoryId = categoriesMap.get(categoryName);

          if (!categoryId) {
            const errorMsg = `Category "${product.categoryName}" not found`;
            console.log(`   ⚠️  Skipping "${product.name}": ${errorMsg}`);
            errors.push({
              restaurant: restaurant.name,
              product: product.name,
              error: errorMsg
            });
            skippedProducts++;
            continue;
          }

          // Validate product data
          if (!product.name || !product.price) {
            const errorMsg = `Invalid product data (missing name or price)`;
            console.log(`   ⚠️  Skipping: ${errorMsg}`);
            errors.push({
              restaurant: restaurant.name,
              product: product.name || 'Unknown',
              error: errorMsg
            });
            skippedProducts++;
            continue;
          }

          // Create product with proper validation
          const isAvailable = product.available !== undefined ? product.available : true;
          await Product.create({
            restaurantId: restaurant._id,
            categoryId: categoryId,
            name: product.name.trim(),
            description: product.description || `${product.name} - Delicious food item`,
            price: Number(product.price) || 0,
            images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []),
            available: isAvailable,
            stock: isAvailable ? 100 : 0
          });

          restaurantProductCount++;
          totalProductsCreated++;
        } catch (error) {
          const errorMsg = error.message || 'Unknown error';
          console.log(`   ❌ Failed to add "${product.name}": ${errorMsg}`);
          errors.push({
            restaurant: restaurant.name,
            product: product.name,
            error: errorMsg
          });
          skippedProducts++;
        }
      }

      console.log(`   📊 Added ${restaurantProductCount} product(s) to "${restaurant.name}"`);
    }

    // Final summary
    const finalCount = await Product.countDocuments();
    console.log('\n' + '='.repeat(50));
    console.log('✅ PRODUCT SEEDING COMPLETE');
    console.log('='.repeat(50));
    console.log(`📊 Total Products in Database: ${finalCount}`);
    console.log(`📊 Products Created in this run: ${totalProductsCreated}`);
    console.log(`⚠️  Products Skipped: ${skippedProducts}`);

    if (errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      errors.forEach(err => {
        console.log(`   - ${err.restaurant} > ${err.product}: ${err.error}`);
      });
    }

    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding products:', error);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const deletedCount = await Product.deleteMany();
    console.log(`✅ Products Deleted. Deleted: ${deletedCount.deletedCount}`);
    const remaining = await Product.countDocuments();
    console.log(`   Remaining: ${remaining}`);
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
