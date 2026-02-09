import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import Restaurant from '../src/models/Restaurant.models.js';
import {
  calculateRestaurantRatings,
  updateSliderStatus,
} from '../src/utils/restaurantRating.util.js';

dotenv.config();

const run = async () => {
  try {
    console.log('\n🔄 Slider update: calculating ratings and slider status...\n');

    const restaurants = await Restaurant.find({ verificationStatus: 'verified' }).select('_id name');
    console.log(`   Found ${restaurants.length} verified restaurants`);

    for (const restaurant of restaurants) {
      await calculateRestaurantRatings(restaurant._id);
    }
    console.log('   ✅ Restaurant ratings calculated');

    const result = await updateSliderStatus();
    console.log(`   ✅ Slider status updated: ${result.top10Count} in slider, ${result.topRatedCount} top-rated (not in slider)\n`);

    const inSlider = await Restaurant.find({ sliderStatus: 'in_slider' }).select('name averageRating orderCount');
    if (inSlider.length > 0) {
      console.log('   📌 Restaurants in slider (homepage):');
      inSlider.forEach((r, i) => console.log(`      ${i + 1}. ${r.name} (rating: ${r.averageRating?.toFixed(1)}, orders: ${r.orderCount})`));
    }
    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('❌ Slider update failed:', error);
    process.exit(1);
  }
};

const exec = async () => {
  await connectDB();
  await run();
};

exec();
