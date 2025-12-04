import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import connectDB from '../db/db.js';
import Review from '../src/models/Review.models.js';
import Product from '../src/models/Product.models.js';
import { User } from '../src/models/user.models.js';

dotenv.config();

// Sample comments for reviews
const sampleComments = [
  "Great taste! Highly recommended.",
  "Very delicious, will order again.",
  "Good quality food, satisfied with my order.",
  "Amazing flavor, exceeded my expectations.",
  "Nice presentation and taste.",
  "Could be better, but overall okay.",
  "Not bad, but expected more.",
  "Excellent service and food quality.",
  "One of the best I've tried!",
  "Good value for money.",
  "Tasty but a bit expensive.",
  "Loved it! Will definitely come back.",
  "Average taste, nothing special.",
  "Perfect! Exactly as described.",
  "Good food, fast delivery.",
];

const importData = async () => {
  try {
    // Check if products exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.error('\n❌ ERROR: No products found in database!');
      console.log('💡 Please run product seeder first:');
      console.log('   npm run seed:products\n');
      process.exit(1);
    }

    // Get or create buyer users for reviews
    let buyers = await User.find({ role: 'buyer' }).limit(10);
    
    // If no buyers exist, create some dummy buyers for seeding
    if (buyers.length === 0) {
      console.log('⚠️  No buyer users found. Creating dummy buyers for seeding...');
      const dummyBuyers = [];
      
      for (let i = 1; i <= 5; i++) {
        const buyer = await User.create({
          name: `Buyer ${i}`,
          username: `buyer${i}`,
          email: `buyer${i}@example.com`,
          password: await bcrypt.hash('password123', 10),
          role: 'buyer',
          isVerified: true,
          status: 'active',
        });
        dummyBuyers.push(buyer);
      }
      buyers = dummyBuyers;
      console.log(`✅ Created ${buyers.length} dummy buyers for seeding`);
    }

    // Clear existing reviews
    await Review.deleteMany();
    console.log('🗑️  Existing reviews deleted');

    // Get all products
    const products = await Product.find();
    console.log(`\n📦 Found ${products.length} products to add reviews to`);

    let totalReviews = 0;

    // Add reviews to each product
    for (const product of products) {
      // Random number of reviews per product (1-8)
      const numReviews = Math.floor(Math.random() * 8) + 1;
      
      // Randomly select buyers for this product
      const shuffledBuyers = [...buyers].sort(() => 0.5 - Math.random());
      const selectedBuyers = shuffledBuyers.slice(0, Math.min(numReviews, buyers.length));

      for (const buyer of selectedBuyers) {
        // Random rating between 3-5 (mostly positive for seeded data)
        const rating = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
        
        // Random comment (70% chance to have a comment)
        const hasComment = Math.random() > 0.3;
        const comment = hasComment 
          ? sampleComments[Math.floor(Math.random() * sampleComments.length)]
          : '';

        try {
          await Review.create({
            productId: product._id,
            buyerId: buyer._id,
            rating,
            comment,
          });

          totalReviews++;
        } catch (error) {
          // Skip if review already exists (shouldn't happen, but just in case)
          if (error.code !== 11000) {
            console.error(`Error creating review for product ${product.name}:`, error.message);
          }
        }
      }

      console.log(`  ✅ Added ${selectedBuyers.length} review(s) to "${product.name}"`);
    }

    const count = await Review.countDocuments();
    console.log(`\n✅ Reviews Seeded Successfully!`);
    console.log(`📊 Total Reviews: ${count}`);
    console.log(`📊 Reviews Added in this run: ${totalReviews}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Review.deleteMany();
    const count = await Review.countDocuments();
    console.log(`❌ Reviews Deleted. Remaining: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting reviews:', error);
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

