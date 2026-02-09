import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css";
import "../assets/style/Products.css";

import { EffectCoverflow, Pagination } from "swiper/modules";
import Foodcard from "./Foodcard";

const API_BASE = "http://localhost:4000/api/v1";

const Products = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRestaurants = async () => {
      try {
        const res = await axios.get(`${API_BASE}/commission/slider`);
        setRestaurants(res.data.data || []);
      } catch (err) {
        console.error("Error fetching top restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRestaurants();
  }, []);

  if (loading) {
    return (
      <section className="products">
        <div className="container">
          <div className="inner">
            <h2>Top Rated Restaurants</h2>
            <p className="products-loading">Loading top restaurants...</p>
          </div>
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <section className="products">
      <div className="container">
        <div className="inner">
          <h2>Top Rated Restaurants</h2>
          <Swiper
            effect={"coverflow"}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            grabCursor={true}
            centeredSlides={false}
            slidesPerView={3}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={false}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper"
          >
            {restaurants.map((restaurant) => (
              <SwiperSlide key={restaurant._id}>
                <Link to={`/explore?restaurant=${restaurant._id}`} className="products-slide-link">
                  <Foodcard
                    isRestaurant
                    product={{
                      id: restaurant._id,
                      name: restaurant.name,
                      image: restaurant.logo || null,
                      rating: restaurant.averageRating != null ? Number(restaurant.averageRating).toFixed(1) : "0.0",
                    }}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Products;
