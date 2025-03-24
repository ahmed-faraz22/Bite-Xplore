import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css';
import "../assets/style/Products.css";

import { EffectCoverflow, Pagination } from 'swiper/modules';
import Foodcard from './Foodcard';

const Products = () => {
  return (
    <>
      <section className="products">
        <div className="container">
          <div className="inner">
            <h2>Lorem ipsum dolor sit amet.</h2>
          <Swiper
        effect={'coverflow'}
        breakpoints={{
            0: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            }
        }}
        grabCursor={true}
        centeredSlides={false}
        slidesPerView={'3'}
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
        <SwiperSlide>
          <Foodcard/>
          
        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
        <SwiperSlide>
        <Foodcard/>

        </SwiperSlide>
      </Swiper>

          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
