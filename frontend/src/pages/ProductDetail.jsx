import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/style/ProductDetail.css";
import Button from "../components/Button";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:8000/explore/products");
        const allProducts = await response.json();

        const foundProduct = allProducts.find((p) => String(p.id) === id);
        if (foundProduct) {
          setProduct(foundProduct);

          // Optional: fetch restaurant data
          const restaurantRes = await fetch(
            `http://localhost:8000/restaurants?location=${foundProduct.restaurantLocation}`
          );
          const restaurants = await restaurantRes.json();

          const matchedRestaurant = restaurants.find((r) =>
            r.products.some((p) => String(p.id) === id)
          );

          if (matchedRestaurant) {
            setRestaurant(matchedRestaurant);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <section className="product-detail">
      <div className="container">
        <div className="inner">
          <div className="product-details">
            <div className="product-img">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-content">
              <div className="resturent-logo">
                <img src={restaurant?.image} alt="Restaurant Logo" />
              </div>
              <div className="head">
                <h3>{product.name}</h3>
                <span>Rs {product.price}</span>
              </div>
              <div className="body">
                <p>{product.description}</p>
                {restaurant && (
                  <ul>
                    <li>
                      <h3>Restaurant Details</h3>
                    </li>
                    <li>Name: {restaurant.name}</li>
                    <li>Location: {restaurant.location}</li>
                    <li>Website: {restaurant.website || "N/A"}</li>
                    <li>Phone: {restaurant.phone || "N/A"}</li>
                    <li>Email: {restaurant.email || "N/A"}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
