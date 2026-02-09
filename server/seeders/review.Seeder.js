import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import Review from '../src/models/Review.models.js';
import Product from '../src/models/Product.models.js';
import Restaurant from '../src/models/Restaurant.models.js';
import { User } from '../src/models/user.models.js';

dotenv.config();

const sampleComments = [
  "Great taste! Highly recommended.",
  "Very delicious, will order again.",
  "Amazing flavor, exceeded my expectations.",
  "One of the best I've tried!",
  "Perfect! Exactly as described.",
  "Good food, fast delivery.",
];

const importData = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.error('\n❌ ERROR: No products found. Run product seeder first.\n');
      process.exit(1);
    }

    let buyers = await User.find({ role: 'buyer' }).limit(15);
    if (buyers.length === 0) {
      console.log('Creating buyer users for reviews...');
      for (let i = 1; i <= 10; i++) {
        const b = await User.create({
          name: `Buyer ${i}`,
          username: `buyer${i}`,
          email: `buyer${i}@example.com`,
          password: 'password123',
          role: 'buyer',
          isVerified: true,
          status: 'active',
        });
        buyers.push(b);
      }
      console.log(`✅ Created ${buyers.length} buyers`);
    }

    await Review.deleteMany();
    console.log('🗑️  Existing reviews deleted\n');

    // Get first 12 restaurants (by creation) – these will get high ratings for slider
    const sliderRestaurants = await Restaurant.find({ verificationStatus: 'verified' })
      .sort({ createdAt: 1 })
      .limit(12)
      .select('_id name');
    const sliderRestaurantIds = new Set(sliderRestaurants.map(r => r._id.toString()));
    console.log(`📌 First 12 restaurants (for slider): ${sliderRestaurants.map(r => r.name).join(', ')}\n`);

    const allProducts = await Product.find().populate('restaurantId', '_id');
    let totalReviews = 0;

    for (const product of allProducts) {
      const restId = product.restaurantId?._id?.toString();
      const isSliderRestaurant = restId && sliderRestaurantIds.has(restId);

      // Slider restaurants: 2–3 reviews per product, rating 4 or 5 only → ensures isTopRated (avg >= 4, 5+ total reviews)
      const numReviews = isSliderRestaurant
        ? Math.min(3, Math.max(2, Math.floor(Math.random() * 2) + 2))
        : Math.floor(Math.random() * 5) + 1;
      const ratingMin = isSliderRestaurant ? 4 : 3;
      const ratingMax = 5;

      const shuffledBuyers = [...buyers].sort(() => 0.5 - Math.random());
      const selectedBuyers = shuffledBuyers.slice(0, Math.min(numReviews, buyers.length));

      for (const buyer of selectedBuyers) {
        const rating = Math.floor(Math.random() * (ratingMax - ratingMin + 1)) + ratingMin;
        const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        try {
          await Review.create({
            productId: product._id,
            buyerId: buyer._id,
            rating,
            comment,
          });
          totalReviews++;
        } catch (e) {
          if (e.code !== 11000) console.error(`Review error ${product.name}:`, e.message);
        }
      }
    }

    const count = await Review.countDocuments();
    console.log(`✅ Reviews seeded: ${count} total (${totalReviews} in this run)\n`);
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

