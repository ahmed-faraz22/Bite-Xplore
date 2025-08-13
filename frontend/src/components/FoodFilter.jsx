import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Productcard from "../components/Productcard";
import "../assets/style/FoodFilter.css";

const FoodFilter = ({ location, restaurant }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);

  const categories = [
    "Burgers",
    "Fast Food",
    "Fries",
    "Wings",
    "Snacks",
    "Desi",
    "Karahi",
    "BBQ",
    "Rice",
    "Bread",
    "Pizza",
    "Italian",
    "Sides",
    "Vegetarian",
    "Non-Vegetarian",
    "Meals",
    "Beverages",
    "Chinese",
    "Platter",
    "Cuisine",
    "Deal",
  ];

  const fetchFilteredProducts = async () => {
    const query = new URLSearchParams();

    if (activeCategories.length > 0) {
      query.append("categories", activeCategories.join(","));
    }
    if (location) query.append("location", location);
    if (restaurant) query.append("restaurant", restaurant);
    try {
      const response = await fetch(
        `http://localhost:8000/explore/products?${query.toString()}`
      );
      const data = await response.json();
      setFilteredProducts(data);
      console.log(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [activeCategories, location, restaurant]);

  const handleCategoryClick = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((cat) => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  return (
    <section className="food-filter">
      <h2>Choose best for you</h2>
      <div className="filter-cta">
        {categories.map((cat) => (
          <Button
            key={cat}
            buttonText={cat}
            buttonLink=""
            onClick={() => handleCategoryClick(cat)}
            className={activeCategories.includes(cat) ? "active" : ""}
          />
        ))}
      </div>

      <div className="container">
        <div className="inner">
          <div className="result-products">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Productcard key={product.id} product={product} />
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodFilter;
