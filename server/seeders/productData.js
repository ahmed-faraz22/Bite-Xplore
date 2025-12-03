// Product data for seeding
// Note: restaurantId and categoryId will be resolved dynamically in the seeder

const productData = [
  // Products for "king manjo" (Lahore) - Fast Food Restaurant
  {
    restaurantName: "king manjo",
    products: [
      {
        categoryName: "Fast Food",
        name: "Chicken Burger",
        description: "Juicy grilled chicken patty with fresh lettuce, tomato, and special sauce in a soft bun",
        price: 450,
        images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Beef Burger",
        description: "Classic beef patty with cheese, onions, pickles, and our signature sauce",
        price: 550,
        images: ["https://images.unsplash.com/photo-1550547660-d9450f859349?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "French Fries",
        description: "Crispy golden fries served with ketchup",
        price: 200,
        images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Chicken Wings",
        description: "Spicy fried chicken wings with ranch dip",
        price: 650,
        images: ["https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Coca Cola",
        description: "Chilled soft drink",
        price: 100,
        images: ["https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"],
        available: true
      },
      {
        categoryName: "Desserts & Sweets",
        name: "Chocolate Shake",
        description: "Rich and creamy chocolate milkshake",
        price: 350,
        images: ["https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500"],
        available: true
      }
    ]
  },
  
  // Products for "kfc" (Islamabad) - Fast Food Restaurant
  {
    restaurantName: "kfc",
    products: [
      {
        categoryName: "Fast Food",
        name: "Zinger Burger",
        description: "Spicy crispy chicken fillet with mayo and fresh vegetables",
        price: 650,
        images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Chicken Bucket (6 Pieces)",
        description: "6 pieces of our signature crispy fried chicken",
        price: 1200,
        images: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Chicken Popcorn",
        description: "Bite-sized crispy chicken pieces",
        price: 450,
        images: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Chicken Wrap",
        description: "Tender chicken strips wrapped in soft tortilla with veggies",
        price: 500,
        images: ["https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Coleslaw",
        description: "Fresh cabbage salad with special dressing",
        price: 200,
        images: ["https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Pepsi",
        description: "Chilled carbonated soft drink",
        price: 100,
        images: ["https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"],
        available: true
      },
      {
        categoryName: "Desserts & Sweets",
        name: "Ice Cream Sundae",
        description: "Vanilla ice cream with chocolate sauce and nuts",
        price: 300,
        images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"],
        available: true
      }
    ]
  },
  
  // Products for "MacDonald" (Rawalpindi) - Fast Food Restaurant
  {
    restaurantName: "MacDonald",
    products: [
      {
        categoryName: "Fast Food",
        name: "Big Mac",
        description: "Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun",
        price: 750,
        images: ["https://images.unsplash.com/photo-1550547660-d9450f859349?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "McChicken",
        description: "Crispy chicken patty with lettuce and mayo",
        price: 550,
        images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "McNuggets (6 Pieces)",
        description: "Tender chicken nuggets with your choice of dipping sauce",
        price: 450,
        images: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Quarter Pounder",
        description: "100% beef patty with cheese, onions, pickles, and ketchup",
        price: 650,
        images: ["https://images.unsplash.com/photo-1550547660-d9450f859349?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Apple Pie",
        description: "Warm apple pie with crispy crust",
        price: 250,
        images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "McFlurry",
        description: "Creamy soft serve with your choice of mix-ins",
        price: 400,
        images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Coca Cola",
        description: "Chilled soft drink",
        price: 100,
        images: ["https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"],
        available: true
      },
      {
        categoryName: "Breakfast Foods",
        name: "Egg McMuffin",
        description: "English muffin with egg, cheese, and Canadian bacon",
        price: 500,
        images: ["https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"],
        available: true
      }
    ]
  }
];

export default productData;

