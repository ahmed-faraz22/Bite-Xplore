import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Productcard from "../components/Productcard";
import "../assets/style/FoodFilter.css";

const FoodFilter = ({ location, restaurant }) => {
  const [products, setProducts] = useState([]); // store all/fetched products
  const [categories, setCategories] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);

  // 🔥 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/categories");
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 🔥 Fetch products
  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams();
      if (activeCategories.length > 0) {
        query.append("categories", activeCategories.join(","));
      }
      if (location) query.append("location", location);
      if (restaurant) query.append("restaurant", restaurant);

      const res = await fetch(
        `http://localhost:4000/api/v1/products?${query.toString()}`
      );
      const data = await res.json();
      setProducts(data.data || []); // use .data because your backend wraps response
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [activeCategories, location, restaurant]);

  const handleCategoryClick = (categoryId) => {
    if (activeCategories.includes(categoryId)) {
      setActiveCategories(activeCategories.filter((id) => id !== categoryId));
    } else {
      setActiveCategories([...activeCategories, categoryId]);
    }
  };

  return (
    <section className="food-filter">
      <h2>Choose best for you</h2>

      {/* Category Filters */}
      <div className="filter-cta">
        {categories.map((cat) => (
          <Button
            key={cat._id}
            buttonText={cat.name}
            buttonLink=""
            onClick={() => handleCategoryClick(cat._id)}
            className={activeCategories.includes(cat._id) ? "active" : ""}
          />
        ))}
      </div>

      {/* Products */}
      <div className="container">
        <div className="inner">
          <div className="result-products">
            {products.length > 0 ? (
              products.map((product) => (
                <Productcard key={product._id} product={product} />
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
