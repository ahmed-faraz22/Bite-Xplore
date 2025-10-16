import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../assets/style/ProductDetail.css";
import Button from "../components/Button";

axios.defaults.withCredentials = true;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduct(res.data.data);
      setRestaurant(res.data.data.restaurantId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch product");
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!token) return toast.error("Please login to add to cart");
    setIsAdding(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/cart/add",
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Added to cart");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <section className="product-detail">
      <div className="container">
        <div className="inner">
          <div className="product-details">
            <div className="product-img">
              <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.name} />
            </div>
            <div className="product-content">
              {restaurant && (
                <div className="resturent-logo">
                  <img src={restaurant.image || "/placeholder.jpg"} alt="Restaurant Logo" />
                </div>
              )}

              <div className="head">
                <h3>{product.name}</h3>
                <span>Rs {product.price}</span>
              </div>

              <div className="body">
                <p>{product.description || "No description available"}</p>
              </div>

              <div className="cta-wrapper">
                <div className="quantity-control">
                  <button onClick={decreaseQuantity} className="quantity-btn">-</button>
                  <span className="quantity-display">{quantity}</span>
                  <button onClick={increaseQuantity} className="quantity-btn">+</button>
                </div>

                <button onClick={handleAddToCart} className="order-btn" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
