import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../assets/style/RestaurantSlider.css";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

const RestaurantSlider = () => {
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTopRestaurants();
  }, []);

  const fetchTopRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/commission/slider");
      setTopRestaurants(res.data.data || []);
    } catch (err) {
      console.error("Error fetching top restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (topRestaurants.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % topRestaurants.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [topRestaurants.length]);

  if (loading) {
    return (
      <div className="restaurant-slider-container">
        <div className="slider-loading">Loading top restaurants...</div>
      </div>
    );
  }

  if (topRestaurants.length === 0) {
    return null;
  }

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + topRestaurants.length) % topRestaurants.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topRestaurants.length);
  };

  return (
    <div className="restaurant-slider-container">
      <div className="slider-header">
        <h2>Top Rated Restaurants</h2>
        <p>Discover the best dining experiences</p>
      </div>

      <div className="slider-wrapper">
        <button className="slider-btn slider-btn-prev" onClick={goToPrevious}>
          &#8249;
        </button>

        <div className="slider-track">
          {topRestaurants.map((restaurant, index) => (
            <div
              key={restaurant._id}
              className={`slider-slide ${index === currentIndex ? "active" : ""}`}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
              }}
            >
              <div className="restaurant-card">
                <div className="restaurant-image">
                  {restaurant.logo ? (
                    <img src={restaurant.logo} alt={restaurant.name} />
                  ) : (
                    <div className="restaurant-placeholder">
                      {restaurant.name.charAt(0)}
                    </div>
                  )}
                  <div className="rating-badge">
                    <FaStar /> {restaurant.averageRating?.toFixed(1) || "0.0"}
                  </div>
                </div>
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <div className="restaurant-meta">
                    <span className="location">
                      <FaMapMarkerAlt /> {restaurant.city}
                    </span>
                    <span className="orders">{restaurant.orderCount || 0} orders</span>
                  </div>
                  <Link to={`/explore?restaurant=${restaurant._id}`} className="view-menu-btn">
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="slider-btn slider-btn-next" onClick={goToNext}>
          &#8250;
        </button>
      </div>

      {/* Dots indicator */}
      {topRestaurants.length > 1 && (
        <div className="slider-dots">
          {topRestaurants.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantSlider;

