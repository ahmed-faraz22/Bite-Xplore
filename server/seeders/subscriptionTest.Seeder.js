import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import { User } from '../src/models/user.models.js';
import Restaurant from '../src/models/Restaurant.models.js';
import Order from '../src/models/Order.models.js';
import Product from '../src/models/Product.models.js';
import Category from '../src/models/Category.models.js';

dotenv.config();

const importData = async () => {
  try {
    console.log('\n🚀 Starting Subscription Test Seeder...\n');

    // Step 1: Get or create a seller user
    let seller = await User.findOne({ role: 'seller', email: 'testrestaurant@example.com' });
    
    if (!seller) {
      console.log('📝 Creating test seller user...');
      seller = await User.create({
        name: 'Test Restaurant Owner',
        username: 'testrestaurant',
        email: 'testrestaurant@example.com',
        password: 'password123', // Let the User model's pre-save hook hash it
        role: 'seller',
        isVerified: true,
        status: 'active',
      });
      console.log(`✅ Created seller: ${seller.email}`);
    } else {
      console.log(`✅ Found existing seller: ${seller.email}`);
      console.log('🔄 Updating password to ensure correct hashing...');
      // Update password to ensure it's correctly hashed (not double-hashed)
      seller.password = 'password123';
      await seller.save(); // This will trigger the pre-save hook to hash it correctly
      console.log(`✅ Password updated for seller: ${seller.email}`);
    }

    // Step 2: Get or create a restaurant for this seller
    let restaurant = await Restaurant.findOne({ ownerId: seller._id });
    
    if (!restaurant) {
      console.log('🏪 Creating test restaurant...');
      restaurant = await Restaurant.create({
        ownerId: seller._id,
        name: 'Test Restaurant (15 Orders)',
        address: '123 Test Street',
        city: 'Karachi',
        phone: '+923001234567',
        hasOwnDelivery: false,
        openingTime: '09:00',
        closingTime: '22:00',
        orderCount: 0, // Will be updated to 15 after creating orders
        subscriptionStatus: 'free',
        isSuspended: false,
      });
      console.log(`✅ Created restaurant: ${restaurant.name}`);
    } else {
      console.log(`✅ Using existing restaurant: ${restaurant.name}`);
    }

    // Step 3: Get or create a category
    let category = await Category.findOne();
    if (!category) {
      console.log('📂 Creating test category...');
      category = await Category.create({
        name: 'Test Category',
        description: 'Category for subscription testing',
      });
      console.log(`✅ Created category: ${category.name}`);
    } else {
      console.log(`✅ Using existing category: ${category.name}`);
    }

    // Step 4: Get or create products for this restaurant
    let products = await Product.find({ restaurantId: restaurant._id });
    
    if (products.length === 0) {
      console.log('🍕 Creating test products...');
      const productData = [
        { name: 'Burger', description: 'Delicious burger', price: 500, stock: 100 },
        { name: 'Pizza', description: 'Cheesy pizza', price: 800, stock: 50 },
        { name: 'Fries', description: 'Crispy fries', price: 200, stock: 200 },
        { name: 'Coke', description: 'Cold drink', price: 100, stock: 300 },
      ];

      for (const prod of productData) {
        const product = await Product.create({
          restaurantId: restaurant._id,
          categoryId: category._id,
          ...prod,
          available: true,
        });
        products.push(product);
      }
      console.log(`✅ Created ${products.length} products`);
    } else {
      console.log(`✅ Using existing ${products.length} products`);
    }

    // Step 5: Get or create a buyer user
    let buyer = await User.findOne({ role: 'buyer', email: 'testbuyer@example.com' });
    
    if (!buyer) {
      console.log('👤 Creating test buyer user...');
      buyer = await User.create({
        name: 'Test Buyer',
        username: 'testbuyer',
        email: 'testbuyer@example.com',
        password: 'password123', // Let the User model's pre-save hook hash it
        role: 'buyer',
        isVerified: true,
        status: 'active',
      });
      console.log(`✅ Created buyer: ${buyer.email}`);
    } else {
      console.log(`✅ Found existing buyer: ${buyer.email}`);
      console.log('🔄 Updating password to ensure correct hashing...');
      // Update password to ensure it's correctly hashed (not double-hashed)
      buyer.password = 'password123';
      await buyer.save(); // This will trigger the pre-save hook to hash it correctly
      console.log(`✅ Password updated for buyer: ${buyer.email}`);
    }

    // Step 6: Delete existing orders for this restaurant (to start fresh)
    const existingOrdersCount = await Order.countDocuments({ restaurantId: restaurant._id });
    if (existingOrdersCount > 0) {
      console.log(`🗑️  Deleting ${existingOrdersCount} existing orders for this restaurant...`);
      await Order.deleteMany({ restaurantId: restaurant._id });
    }

    // Step 7: Create 15 orders for this restaurant
    console.log('\n📦 Creating 15 orders...');
    const orders = [];
    
    for (let i = 1; i <= 15; i++) {
      // Select random products for each order (1-3 products per order)
      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      const orderItems = selectedProducts.map(product => ({
        productId: product._id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: product.price,
      }));

      const totalPrice = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const deliveryBy = restaurant.hasOwnDelivery ? 'restaurant' : 'platform';
      const deliveryFee = deliveryBy === 'platform' ? 200 : 0;
      const restaurantAmount = totalPrice;
      const platformAmount = deliveryFee;
      const totalWithDelivery = totalPrice + deliveryFee;

      const order = await Order.create({
        buyerId: buyer._id,
        restaurantId: restaurant._id,
        items: orderItems,
        totalPrice: totalWithDelivery,
        deliveryFee,
        restaurantAmount,
        platformAmount,
        status: ['pending', 'confirmed', 'preparing', 'delivered'][Math.floor(Math.random() * 4)],
        paymentMethod: 'online',
        paymentStatus: 'paid',
        paymentId: 'seed_order_' + Date.now() + '_' + i,
        deliveryBy,
        deliveryStatus: 'delivered',
        restaurantConfirmation: true,
        confirmedAt: new Date(),
      });

      orders.push(order);
      console.log(`  ✅ Order ${i}/15 created - Total: PKR ${totalPrice}`);
    }

    // Step 8: Update restaurant orderCount to 15
    restaurant.orderCount = 15;
    restaurant.subscriptionStatus = 'free'; // Still on free tier, but at the limit
    restaurant.isSuspended = false;
    await restaurant.save();

    console.log('\n✅ Subscription Test Seeder Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👤 Seller: ${seller.email} (password: password123)`);
    console.log(`   🏪 Restaurant: ${restaurant.name}`);
    console.log(`   📦 Orders Created: ${orders.length}`);
    console.log(`   📈 Restaurant Order Count: ${restaurant.orderCount}`);
    console.log(`   💰 Subscription Status: ${restaurant.subscriptionStatus}`);
    console.log('\n💡 Next Steps:');
    console.log('   1. Login as the seller (testrestaurant@example.com / password123)');
    console.log('   2. Try to place a new order (16th order)');
    console.log('   3. You should see a message requiring subscription payment');
    console.log('   4. Go to /dashboard/subscription to activate subscription\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subscription test data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('\n🗑️  Deleting subscription test data...\n');

    // Find the test restaurant
    const seller = await User.findOne({ email: 'testrestaurant@example.com' });
    if (seller) {
      const restaurant = await Restaurant.findOne({ ownerId: seller._id });
      if (restaurant) {
        // Delete orders for this restaurant
        const deletedOrders = await Order.deleteMany({ restaurantId: restaurant._id });
        console.log(`✅ Deleted ${deletedOrders.deletedCount} orders`);

        // Reset restaurant order count
        restaurant.orderCount = 0;
        restaurant.subscriptionStatus = 'free';
        restaurant.isSuspended = false;
        await restaurant.save();
        console.log('✅ Reset restaurant order count');
      }
    }

    console.log('✅ Subscription test data deleted\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting subscription test data:', error);
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

