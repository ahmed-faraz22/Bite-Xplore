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
        // ✅ fetch product by ID
        const res = await fetch(`http://localhost:4000/api/v1/products/${id}`);
        const data = await res.json();

        if (data?.data) {
          setProduct(data.data);

          // ✅ if product has restaurantId, fetch restaurant
          if (data.data.restaurantId) {
            const restRes = await fetch(
              `http://localhost:4000/api/v1/restaurants/${data.data.restaurantId}`
            );
            const restData = await restRes.json();
            setRestaurant(restData?.data || null);
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
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
              />
            </div>
            <div className="product-content">
              {restaurant && (
                <div className="resturent-logo">
                  <img
                    src={restaurant.image || "/placeholder.jpg"}
                    alt="Restaurant Logo"
                  />
                </div>
              )}
              <div className="head">
                <h3>{product.name}</h3>
                <span>Rs {product.price}</span>
              </div>
              <div className="body">
                <p>{product.description || "No description available"}</p>
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
              <Button buttonText="Order Now" buttonLink={`/checkout/${id}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
  