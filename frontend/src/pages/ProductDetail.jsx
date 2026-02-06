import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import "../assets/style/ProductDetail.css";
import Button from "../components/Button";
import { CartContext } from "../context/CartContext.jsx";

axios.defaults.withCredentials = true;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [userReview, setUserReview] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    if (token) {
      fetchUserReview();
    }
  }, [id, token]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/products/${id}`);
      const productData = res.data.data;
      setProduct(productData);
      setRestaurant(productData.restaurantId);
      setRestaurantMenu(productData.restaurantMenu || []);
      setAverageRating(productData.averageRating || 0);
      setTotalReviews(productData.totalReviews || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch product");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/reviews/product/${id}`);
      setReviews(res.data.data.reviews || []);
      setAverageRating(res.data.data.averageRating || 0);
      setTotalReviews(res.data.data.totalReviews || 0);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const fetchUserReview = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/reviews/product/${id}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.data) {
        setUserReview(res.data.data);
        setUserRating(res.data.data.rating);
        setUserComment(res.data.data.comment || "");
      }
    } catch (err) {
      // User hasn't reviewed yet, that's okay
      console.log("No user review found");
    }
  };

  const handleRatingSubmit = async () => {
    if (!token) {
      toast.error("Please login to rate this product");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmittingRating(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/reviews/",
        {
          productId: id,
          rating: userRating,
          comment: userComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success(res.data.message || "Rating submitted successfully");
      setUserReview(res.data.data);
      fetchReviews();
      fetchProduct(); // Refresh product to get updated average rating
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const { fetchCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    if (!token) return toast.error("Please login to add to cart");
    if (product.stock === 0) return toast.error("This product is not available");
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    setIsAdding(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/cart/add",
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Added to cart");
      // Refresh cart count
      if (fetchCart) {
        fetchCart();
      }
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
              {/* Restaurant Information */}
              {restaurant && (
                <div className="restaurant-info">
                  <div className="restaurant-header">
                    {restaurant.logo && (
                      <div className="restaurant-logo">
                        <img src={restaurant.logo} alt={`${restaurant.name} Logo`} />
                      </div>
                    )}
                    <div className="restaurant-details">
                      <h2>{restaurant.name}</h2>
                      <div className="restaurant-meta">
                        {restaurant.address && <p><strong>Address:</strong> {restaurant.address}</p>}
                        {restaurant.city && <p><strong>City:</strong> {restaurant.city}</p>}
                        {restaurant.phone && <p><strong>Phone:</strong> {restaurant.phone}</p>}
                        {(restaurant.openingTime || restaurant.closingTime) && (
                          <p><strong>Opening Hours:</strong> {restaurant.openingTime || "09:00"} - {restaurant.closingTime || "22:00"}</p>
                        )}
                        {restaurant.hasOwnDelivery && <p className="delivery-badge">✓ Has Own Delivery</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="head">
                <h3>{product.name}</h3>
                <span>Rs {product.price}</span>
              </div>

              {/* Rating Display */}
              <div className="product-rating-display">
                <div className="rating-stars-display">
                  {[...Array(5)].map((_, index) => (
                    index < Math.floor(averageRating) ? (
                      <FaStar key={`rating-${index}`} className="star-filled" />
                    ) : index < averageRating ? (
                      <FaStar key={`rating-${index}`} className="star-half" />
                    ) : (
                      <CiStar key={`rating-${index}`} className="star-empty" />
                    )
                  ))}
                </div>
                {averageRating > 0 ? (
                  <span className="rating-info">
                    {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                ) : (
                  <span className="rating-info">No ratings yet</span>
                )}
              </div>

              {/* Availability Display */}
              <div className="product-stock-display">
                <span className={product.stock > 0 ? "stock-badge in-stock" : "stock-badge out-of-stock"}>
                  {product.stock > 0 ? (
                    <>
                      <span className="stock-icon">✓</span>
                      Available
                    </>
                  ) : (
                    <>
                      <span className="stock-icon">✗</span>
                      Not Available
                    </>
                  )}
                </span>
              </div>

              <div className="body">
                <p>{product.description || "No description available"}</p>
              </div>

              {/* Rating Input Section - Only show if user is logged in */}
              {token ? (
                <div className="rating-section">
                  <h4>Rate this product</h4>
                  <div className="rating-input">
                    <span className="rating-label">Your Rating:</span>
                    <div className="star-rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= userRating ? "star-input-filled" : "star-input-empty"}
                          onClick={() => setUserRating(star)}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="comment-input">
                    <label htmlFor="comment">Your Comment (Optional):</label>
                    <textarea
                      id="comment"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={handleRatingSubmit}
                    className="submit-rating-btn"
                    disabled={isSubmittingRating || userRating === 0}
                  >
                    {isSubmittingRating ? "Submitting..." : userReview ? "Update Rating" : "Submit Rating"}
                  </button>
                </div>
              ) : (
                <div className="rating-section login-prompt">
                  <p>Please <Link to="/auth">login</Link> to rate this product</p>
                </div>
              )}

              <div className="cta-wrapper">
                <div className="quantity-control">
                  <button 
                    onClick={decreaseQuantity} 
                    className="quantity-btn"
                    disabled={product.stock === 0}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={increaseQuantity} 
                    className="quantity-btn"
                    disabled={product.stock === 0 || quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart} 
                  className="order-btn" 
                  disabled={isAdding || product.stock === 0}
                >
                  {isAdding ? "Adding..." : product.stock === 0 ? "Not Available" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="reviews-section">
              <h2>Customer Reviews ({totalReviews})</h2>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <strong>{review.buyerId?.name || "Anonymous"}</strong>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, index) => (
                          index < review.rating ? (
                            <FaStar key={index} className="star-filled-small" />
                          ) : (
                            <CiStar key={index} className="star-empty-small" />
                          )
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="review-comment">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restaurant Menu Section */}
          {restaurantMenu && restaurantMenu.length > 0 && (
            <div className="restaurant-menu-section">
              <h2>Menu from {restaurant?.name}</h2>
              <div className="menu-grid">
                {restaurantMenu.map((menuItem) => (
                  <div key={menuItem._id} className="menu-item-card">
                    <div className="menu-item-image">
                      <img 
                        src={menuItem.images?.[0] || "/placeholder.jpg"} 
                        alt={menuItem.name} 
                      />
                    </div>
                    <div className="menu-item-content">
                      <h4>{menuItem.name}</h4>
                      <p className="menu-item-description">
                        {menuItem.description || "No description"}
                      </p>
                      <div className="menu-item-footer">
                        <span className="menu-item-price">Rs {menuItem.price}</span>
                        <Button
                          buttonLink={`/product/${menuItem._id}`}
                          buttonText="View"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
