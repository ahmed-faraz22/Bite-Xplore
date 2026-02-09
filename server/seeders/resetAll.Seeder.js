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
    console.log('\n🗑️  Starting full database reset...\n');

    // Delete all data in dependency order (child collections first)
    console.log('🗑️  Deleting Orders...');
    const deletedOrders = await Order.deleteMany();
    console.log(`   ✅ Deleted ${deletedOrders.deletedCount} orders`);

    console.log('🗑️  Deleting Carts...');
    const deletedCarts = await Cart.deleteMany();
    console.log(`   ✅ Deleted ${deletedCarts.deletedCount} carts`);

    console.log('🗑️  Deleting Reviews...');
    const deletedReviews = await Review.deleteMany();
    console.log(`   ✅ Deleted ${deletedReviews.deletedCount} reviews`);

    console.log('🗑️  Deleting Products...');
    const deletedProducts = await Product.deleteMany();
    console.log(`   ✅ Deleted ${deletedProducts.deletedCount} products`);

    console.log('🗑️  Deleting Restaurants...');
    const deletedRestaurants = await Restaurant.deleteMany();
    console.log(`   ✅ Deleted ${deletedRestaurants.deletedCount} restaurants`);

    console.log('🗑️  Deleting Categories...');
    const deletedCategories = await Category.deleteMany();
    console.log(`   ✅ Deleted ${deletedCategories.deletedCount} categories`);

    console.log('🗑️  Deleting Users (sellers and buyers; admin will be re-seeded)...');
    const deletedUsers = await User.deleteMany({ role: { $in: ['seller', 'buyer'] } });
    console.log(`   ✅ Deleted ${deletedUsers.deletedCount} users`);

    console.log('\n✅ Database reset completed successfully!\n');
    console.log('📝 Next: run full seed with: npm run seed:full\n');
    
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


