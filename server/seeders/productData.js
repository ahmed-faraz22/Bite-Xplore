// Product data for seeding
// Products are evenly distributed among all restaurants in the database

const productData = [
  // Fast Food Items
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Fast Food",
        name: "Classic Burger",
        description: "Juicy beef patty with fresh vegetables and special sauce",
        price: 450,
        images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Cheese Burger",
        description: "Beef patty with melted cheese, lettuce, and tomato",
        price: 500,
        images: ["https://images.unsplash.com/photo-1553979459-d2229ba7433f?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Chicken Burger",
        description: "Crispy chicken fillet with mayo and fresh vegetables",
        price: 420,
        images: ["https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "French Fries",
        description: "Crispy golden fries served hot",
        price: 180,
        images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Cheese Fries",
        description: "Fries topped with melted cheese and jalapeños",
        price: 250,
        images: ["https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Chicken Wings",
        description: "Spicy buffalo wings with ranch dip",
        price: 650,
        images: ["https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Chicken Nuggets",
        description: "6 pieces of crispy chicken nuggets",
        price: 350,
        images: ["https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Zinger Burger",
        description: "Spicy zinger patty with coleslaw",
        price: 550,
        images: ["https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Grilled Chicken Sandwich",
        description: "Grilled chicken breast with vegetables",
        price: 480,
        images: ["https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Fish Burger",
        description: "Crispy fish fillet with tartar sauce",
        price: 500,
        images: ["https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500"],
        available: true
      }
    ]
  },
  // Pizza Items
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Fast Food",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, mozzarella, and basil",
        price: 750,
        images: ["https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Pepperoni Pizza",
        description: "Pizza topped with pepperoni and cheese",
        price: 950,
        images: ["https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "BBQ Chicken Pizza",
        description: "Chicken, BBQ sauce, onions, and cheese",
        price: 1100,
        images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Supreme Pizza",
        description: "All meat toppings with vegetables and cheese",
        price: 1200,
        images: ["https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Vegetable Pizza",
        description: "Fresh vegetables with mozzarella cheese",
        price: 800,
        images: ["https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"],
        available: true
      },
      {
        categoryName: "Fast Food",
        name: "Hawaiian Pizza",
        description: "Ham, pineapple, and cheese",
        price: 900,
        images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"],
        available: true
      }
    ]
  },
  // Beverages
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Beverages",
        name: "Coca Cola",
        description: "Refreshing cola drink",
        price: 100,
        images: ["https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Pepsi",
        description: "Classic Pepsi cola",
        price: 100,
        images: ["https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Sprite",
        description: "Lemon-lime soft drink",
        price: 100,
        images: ["https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 150,
        images: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Mango Shake",
        description: "Creamy mango milkshake",
        price: 200,
        images: ["https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Strawberry Shake",
        description: "Fresh strawberry milkshake",
        price: 200,
        images: ["https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Iced Coffee",
        description: "Cold brewed coffee with ice",
        price: 250,
        images: ["https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Hot Coffee",
        description: "Freshly brewed hot coffee",
        price: 200,
        images: ["https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Cappuccino",
        description: "Espresso with steamed milk foam",
        price: 300,
        images: ["https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500"],
        available: true
      },
      {
        categoryName: "Beverages",
        name: "Latte",
        description: "Espresso with steamed milk",
        price: 320,
        images: ["https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500"],
        available: true
      }
    ]
  },
  // Breakfast Items
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Breakfast Foods",
        name: "Pancakes",
        description: "Fluffy pancakes with maple syrup",
        price: 350,
        images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"],
        available: true
      },
      {
        categoryName: "Breakfast Foods",
        name: "French Toast",
        description: "Bread dipped in egg and fried",
        price: 320,
        images: ["https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500"],
        available: true
      },
      {
        categoryName: "Breakfast Foods",
        name: "Scrambled Eggs",
        description: "Creamy scrambled eggs with toast",
        price: 250,
        images: ["https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"],
        available: true
      },
      {
        categoryName: "Breakfast Foods",
        name: "Omelette",
        description: "Three-egg omelette with vegetables",
        price: 300,
        images: ["https://images.unsplash.com/photo-1612929633736-8fe44f7ec841?w=500"],
        available: true
      },
      {
        categoryName: "Breakfast Foods",
        name: "Fried Eggs",
        description: "Two sunny-side-up eggs",
        price: 200,
        images: ["https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"],
        available: true
      },
      {
        categoryName: "Breakfast Foods",
        name: "Hash Browns",
        description: "Crispy fried potato hash browns",
        price: 180,
        images: ["https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"],
        available: true
      },
      {
        categoryName: "Breakfast Foods",
        name: "Breakfast Sandwich",
        description: "Egg, cheese, and bacon on toast",
        price: 400,
        images: ["https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"],
        available: true
      }
    ]
  },
  // Desserts
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Desserts & Sweets",
        name: "Chocolate Cake",
        description: "Rich chocolate layer cake",
        price: 450,
        images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"],
        available: true
      },
      {
        categoryName: "Desserts & Sweets",
        name: "Ice Cream Sundae",
        description: "Vanilla ice cream with chocolate sauce",
        price: 300,
        images: ["https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"],
        available: true
      },
      {
        categoryName: "Desserts & Sweets",
        name: "Brownie",
        description: "Chocolate brownie with ice cream",
        price: 280,
        images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500"],
        available: true
      },
      {
        categoryName: "Desserts & Sweets",
        name: "Apple Pie",
        description: "Homemade apple pie slice",
        price: 350,
        images: ["https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500"],
        available: true
      },
      {
        categoryName: "Desserts & Sweets",
        name: "Cheesecake",
        description: "New York style cheesecake",
        price: 500,
        images: ["https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500"],
        available: true
      },
      {
        categoryName: "Desserts & Sweets",
        name: "Donuts (6 pieces)",
        description: "Assorted glazed donuts",
        price: 400,
        images: ["https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500"],
        available: true
      }
    ]
  },
  // Soups
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Soups & Stews",
        name: "Chicken Soup",
        description: "Hot chicken noodle soup",
        price: 280,
        images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"],
        available: true
      },
      {
        categoryName: "Soups & Stews",
        name: "Tomato Soup",
        description: "Creamy tomato soup",
        price: 250,
        images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"],
        available: true
      },
      {
        categoryName: "Soups & Stews",
        name: "Corn Soup",
        description: "Sweet corn soup",
        price: 270,
        images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"],
        available: true
      },
      {
        categoryName: "Soups & Stews",
        name: "Mushroom Soup",
        description: "Creamy mushroom soup",
        price: 290,
        images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"],
        available: true
      }
    ]
  },
  // Salads & Healthy Options
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Vegan & Plant-Based Foods",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with Caesar dressing",
        price: 350,
        images: ["https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500"],
        available: true
      },
      {
        categoryName: "Vegan & Plant-Based Foods",
        name: "Greek Salad",
        description: "Fresh vegetables with feta cheese and olives",
        price: 380,
        images: ["https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500"],
        available: true
      },
      {
        categoryName: "Vegan & Plant-Based Foods",
        name: "Garden Salad",
        description: "Mixed greens with vegetables and dressing",
        price: 300,
        images: ["https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500"],
        available: true
      },
      {
        categoryName: "Vegan & Plant-Based Foods",
        name: "Vegetable Wrap",
        description: "Fresh vegetables wrapped in tortilla",
        price: 320,
        images: ["https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500"],
        available: true
      }
    ]
  },
  // Baked Goods
  {
    restaurantName: "common",
    products: [
      {
        categoryName: "Baked Goods & Pastries",
        name: "Croissant",
        description: "Buttery French croissant",
        price: 150,
        images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500"],
        available: true
      },
      {
        categoryName: "Baked Goods & Pastries",
        name: "Chocolate Muffin",
        description: "Freshly baked chocolate muffin",
        price: 180,
        images: ["https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500"],
        available: true
      },
      {
        categoryName: "Baked Goods & Pastries",
        name: "Blueberry Muffin",
        description: "Fresh blueberry muffin",
        price: 180,
        images: ["https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500"],
        available: true
      },
      {
        categoryName: "Baked Goods & Pastries",
        name: "Bagel with Cream Cheese",
        description: "Fresh bagel with cream cheese spread",
        price: 200,
        images: ["https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500"],
        available: true
      }
    ]
  }
];

export default productData;
