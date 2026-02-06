import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import Product from '../src/models/Product.models.js';
import Category from '../src/models/Category.models.js';
import Review from '../src/models/Review.models.js';
import Order from '../src/models/Order.models.js';
import Cart from '../src/models/Cart.models.js';
import Restaurant from '../src/models/Restaurant.models.js';
import { User } from '../src/models/user.models.js';

dotenv.config();

const resetAll = async () => {
  try {
    console.log('\n🗑️  Starting database reset...\n');

    // Delete all data in order (respecting foreign key constraints)
    console.log('🗑️  Deleting Orders...');
    const deletedOrders = await Order.deleteMany();
    console.log(`   ✅ Deleted ${deletedOrders.deletedCount} orders`);

    console.log('🗑️  Deleting Reviews...');
    const deletedReviews = await Review.deleteMany();
    console.log(`   ✅ Deleted ${deletedReviews.deletedCount} reviews`);

    console.log('🗑️  Deleting Carts...');
    const deletedCarts = await Cart.deleteMany();
    console.log(`   ✅ Deleted ${deletedCarts.deletedCount} carts`);

    console.log('🗑️  Deleting Products...');
    const deletedProducts = await Product.deleteMany();
    console.log(`   ✅ Deleted ${deletedProducts.deletedCount} products`);

    console.log('🗑️  Deleting Categories...');
    const deletedCategories = await Category.deleteMany();
    console.log(`   ✅ Deleted ${deletedCategories.deletedCount} categories`);

    // Note: We don't delete Restaurants and Users as they might be needed
    // But we can reset restaurant order counts
    console.log('🔄 Resetting restaurant order counts...');
    await Restaurant.updateMany({}, { 
      $set: { 
        orderCount: 0,
        subscriptionStatus: 'free',
        isSuspended: false,
        subscriptionExpiry: null,
        lastPaymentDate: null
      } 
    });
    console.log('   ✅ Reset all restaurant order counts and subscription status');

    console.log('\n✅ Database reset completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('   1. Run: npm run seed:admin (create admin user)');
    console.log('   2. Run: npm run seed:categories (seed categories)');
    console.log('   3. Run: npm run seed:products (seed products)');
    console.log('   4. Run: npm run seed:reviews (optional)');
    console.log('   5. Run: npm run seed:subscription-test (optional, for testing)');
    console.log('\n💡 Or use: npm run seed:full-reset (resets and seeds everything)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

const runReset = async () => {
  await connectDB();
  await resetAll();
};

runReset();


