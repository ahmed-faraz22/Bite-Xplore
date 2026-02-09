import dotenv from 'dotenv';
import connectDB from '../db/db.js';
import { User } from '../src/models/user.models.js';
import Restaurant from '../src/models/Restaurant.models.js';

dotenv.config();

const restaurantData = [
  {
    user: {
      name: 'Muhammad Ali',
      username: 'mali',
      email: 'mali@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'MacDonald',
      address: '123 Main Street',
      city: 'Karachi',
      phone: '+923001234567',
      hasOwnDelivery: true,
      openingTime: '09:00',
      closingTime: '23:00',
      logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    }
  },
  {
    user: {
      name: 'Ahmed Khan',
      username: 'ahmedk',
      email: 'ahmedk@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'KFC Pakistan',
      address: '456 Food Avenue',
      city: 'Lahore',
      phone: '+923001234568',
      hasOwnDelivery: false,
      openingTime: '10:00',
      closingTime: '22:00',
      logo: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    }
  },
  {
    user: {
      name: 'Hassan Malik',
      username: 'hassanm',
      email: 'hassanm@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Pizza Hut',
      address: '789 Fast Food Lane',
      city: 'Islamabad',
      phone: '+923001234569',
      hasOwnDelivery: true,
      openingTime: '11:00',
      closingTime: '23:00',
      logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    }
  },
  {
    user: {
      name: 'Usman Sheikh',
      username: 'usmans',
      email: 'usmans@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Burger King',
      address: '321 Burger Street',
      city: 'Karachi',
      phone: '+923001234570',
      hasOwnDelivery: true,
      openingTime: '09:00',
      closingTime: '22:00',
      logo: 'https://images.unsplash.com/photo-1553979459-d2229ba7433f?w=400',
    }
  },
  {
    user: {
      name: 'Zain Iqbal',
      username: 'zaini',
      email: 'zaini@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Subway',
      address: '654 Sandwich Road',
      city: 'Lahore',
      phone: '+923001234571',
      hasOwnDelivery: false,
      openingTime: '08:00',
      closingTime: '21:00',
      logo: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    }
  },
  {
    user: {
      name: 'Bilal Raza',
      username: 'bilalr',
      email: 'bilalr@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Domino\'s Pizza',
      address: '987 Pizza Circle',
      city: 'Islamabad',
      phone: '+923001234572',
      hasOwnDelivery: true,
      openingTime: '10:00',
      closingTime: '23:00',
      logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    }
  },
  {
    user: {
      name: 'Faisal Butt',
      username: 'faisalb',
      email: 'faisalb@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Mcdonald\'s Express',
      address: '147 Quick Food Drive',
      city: 'Karachi',
      phone: '+923001234573',
      hasOwnDelivery: true,
      openingTime: '07:00',
      closingTime: '24:00',
      logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    }
  },
  {
    user: {
      name: 'Tariq Mahmood',
      username: 'tariqm',
      email: 'tariqm@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Nando\'s',
      address: '258 Chicken Avenue',
      city: 'Lahore',
      phone: '+923001234574',
      hasOwnDelivery: true,
      openingTime: '12:00',
      closingTime: '23:00',
      logo: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    }
  },
  {
    user: {
      name: 'Rashid Hussain',
      username: 'rashidh',
      email: 'rashidh@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Hardee\'s',
      address: '369 Fast Food Boulevard',
      city: 'Islamabad',
      phone: '+923001234575',
      hasOwnDelivery: false,
      openingTime: '09:00',
      closingTime: '22:00',
      logo: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
    }
  },
  {
    user: {
      name: 'Imran Qureshi',
      username: 'imranq',
      email: 'imranq@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Dunkin Donuts',
      address: '741 Coffee Street',
      city: 'Karachi',
      phone: '+923001234576',
      hasOwnDelivery: false,
      openingTime: '08:00',
      closingTime: '22:00',
      logo: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    }
  },
  {
    user: {
      name: 'Nadeem Aslam',
      username: 'nadeema',
      email: 'nadeema@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Gloria Jean\'s Coffees',
      address: '852 Beverage Road',
      city: 'Lahore',
      phone: '+923001234577',
      hasOwnDelivery: true,
      openingTime: '07:00',
      closingTime: '22:00',
      logo: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    }
  },
  {
    user: {
      name: 'Shahid Afridi',
      username: 'shahida',
      email: 'shahida@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'OPTP - Over The Top Pizza',
      address: '963 Pizza Hub',
      city: 'Islamabad',
      phone: '+923001234578',
      hasOwnDelivery: true,
      openingTime: '11:00',
      closingTime: '23:00',
      logo: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    }
  },
  {
    user: {
      name: 'Kamran Akmal',
      username: 'kamrana',
      email: 'kamrana@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Butlers Chocolate Cafe',
      address: '159 Dessert Lane',
      city: 'Karachi',
      phone: '+923001234579',
      hasOwnDelivery: false,
      openingTime: '10:00',
      closingTime: '21:00',
      logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    }
  },
  {
    user: {
      name: 'Yasir Shah',
      username: 'yasirs',
      email: 'yasirs@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Texas Chicken',
      address: '357 Fried Chicken Road',
      city: 'Lahore',
      phone: '+923001234580',
      hasOwnDelivery: true,
      openingTime: '11:00',
      closingTime: '23:00',
      logo: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    }
  },
  {
    user: {
      name: 'Babar Azam',
      username: 'babara',
      email: 'babara@restaurant.com',
      password: 'password123',
    },
    restaurant: {
      name: 'Gourmet Kitchen',
      address: '468 Fine Dining Avenue',
      city: 'Islamabad',
      phone: '+923001234581',
      hasOwnDelivery: true,
      openingTime: '12:00',
      closingTime: '23:00',
      logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    }
  }
];

const importData = async () => {
  try {
    console.log('\n🏪 Starting Restaurant Seeding Process...\n');

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (let index = 0; index < restaurantData.length; index++) {
      const data = restaurantData[index];
      try {
        let user = await User.findOne({ email: data.user.email });

        if (!user) {
          user = await User.create({
            name: data.user.name,
            username: data.user.username,
            email: data.user.email,
            password: data.user.password,
            role: 'seller',
            isVerified: true,
            status: 'active',
          });
          console.log(`✅ Created user: ${user.email}`);
        } else {
          user.name = data.user.name;
          user.username = data.user.username;
          user.password = data.user.password;
          user.role = 'seller';
          user.isVerified = true;
          user.status = 'active';
          await user.save();
          console.log(`🔄 Updated user: ${user.email}`);
          updatedCount++;
        }

        let restaurant = await Restaurant.findOne({ ownerId: user._id });

        const paymentDetails = {
          accountHolderName: data.user.name,
          accountNumber: 'SEED' + String(index + 1).padStart(4, '0'),
          bankName: 'Test Bank',
          iban: 'PK00TEST0000000000000000',
          paymentMethod: 'bank_transfer',
        };

        const orderCount = index < 15 ? Math.max(4, 50 - index * 3) : 0;

        if (!restaurant) {
          restaurant = await Restaurant.create({
            ownerId: user._id,
            name: data.restaurant.name,
            address: data.restaurant.address,
            city: data.restaurant.city,
            phone: data.restaurant.phone,
            logo: data.restaurant.logo || null,
            hasOwnDelivery: data.restaurant.hasOwnDelivery,
            openingTime: data.restaurant.openingTime,
            closingTime: data.restaurant.closingTime,
            verificationStatus: 'verified',
            verifiedAt: new Date(),
            verificationProvider: 'manual',
            orderCount,
            subscriptionStatus: 'free',
            isSuspended: false,
            paymentDetails,
          });
          console.log(`✅ Created restaurant: ${restaurant.name} (${restaurant.city})`);
          createdCount++;
        } else {
          restaurant.name = data.restaurant.name;
          restaurant.address = data.restaurant.address;
          restaurant.city = data.restaurant.city;
          restaurant.phone = data.restaurant.phone;
          restaurant.logo = data.restaurant.logo || restaurant.logo;
          restaurant.hasOwnDelivery = data.restaurant.hasOwnDelivery;
          restaurant.openingTime = data.restaurant.openingTime;
          restaurant.closingTime = data.restaurant.closingTime;
          restaurant.verificationStatus = 'verified';
          restaurant.verifiedAt = restaurant.verifiedAt || new Date();
          restaurant.orderCount = orderCount;
          restaurant.paymentDetails = paymentDetails;
          await restaurant.save();
          console.log(`🔄 Updated restaurant: ${restaurant.name} (${restaurant.city})`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${data.user.email}:`, error.message);
        skippedCount++;
      }
    }

    // Final summary
    const totalRestaurants = await Restaurant.countDocuments();
    console.log('\n' + '='.repeat(50));
    console.log('✅ RESTAURANT SEEDING COMPLETE');
    console.log('='.repeat(50));
    console.log(`📊 Total Restaurants in Database: ${totalRestaurants}`);
    console.log(`✅ Created: ${createdCount}`);
    console.log(`🔄 Updated: ${updatedCount}`);
    console.log(`⚠️  Skipped: ${skippedCount}`);
    console.log('\n📝 All restaurants are auto-verified for testing purposes\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding restaurants:', error);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('\n🗑️  Deleting seeded restaurants and users...\n');

    // Delete seeded restaurants (by email pattern)
    const seededUsers = await User.find({ 
      email: { $regex: /@restaurant\.com$/ },
      role: 'seller'
    });

    for (const user of seededUsers) {
      const restaurant = await Restaurant.findOne({ ownerId: user._id });
      if (restaurant) {
        await Restaurant.deleteOne({ _id: restaurant._id });
        console.log(`🗑️  Deleted restaurant: ${restaurant.name}`);
      }
      await User.deleteOne({ _id: user._id });
      console.log(`🗑️  Deleted user: ${user.email}`);
    }

    console.log('\n✅ Seeded restaurants and users deleted\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting seeded data:', error);
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

