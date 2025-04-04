"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ReviewItem from "../review/ReviewItem";

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ReviewContainer = () => {
  return (
    <div className="w-full">
      <p className="text-semibold pb-2">Các đánh giá gần đây</p>
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Autoplay]}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>{<ReviewItem />}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewContainer;
