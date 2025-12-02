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

  // Dummy data
  useEffect(() => {
    const dummyRestaurants = [
      {
        id: 1,
        name: "Italiano Delight",
        image: "https://img.freepik.com/free-photo/delicious-burger-studio_23-2151846495.jpg?semt=ais_hybrid&w=740&q=80",
        averageRating: 4.5,
        location: "New York",
      },
      {
        id: 2,
        name: "Sushi World",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg",
        averageRating: 4.8,
        location: "Tokyo",
      },
      {
        id: 3,
        name: "Burger Hub",
        image: "https://i.ytimg.com/vi/TR6uEJURHYU/maxresdefault.jpg",
        averageRating: 4.2,
        location: "Los Angeles",
      },
      {
        id: 4,
        name: "Curry Palace",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZyukz4gg7god4Za_BwstWhBrcDteVCaWQIQ&s",
        averageRating: 4.7,
        location: "Delhi",
      },
    ];

    setRestaurants(dummyRestaurants);
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
