import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css";
import "../assets/style/Products.css";

import { EffectCoverflow, Pagination } from "swiper/modules";
import Foodcard from "./Foodcard";

const Products = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/restaurants/top-rated")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
      })
      .catch((err) => console.error("Failed to fetch restaurants:", err));
  }, []);

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
              <SwiperSlide key={restaurant.id}>
                <Foodcard 
                  product={{
                    id: restaurant.id,
                    name: restaurant.name,
                    image: restaurant.image,
                    rating: restaurant.averageRating,
                    // restaurantLocation: restaurant.location,
                    // Adding these to maintain compatibility with Foodcard
                    // price: 0,
                    // categories: []
                  }} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Products;