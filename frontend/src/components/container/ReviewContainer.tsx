"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ReviewItem from "../review/ReviewItem";
import { IReview } from "@/app/types/review";
import { listItemSecondaryActionClasses } from "@mui/material";
import ReviewModal from "../modal/ReviewModal";

interface IProps {
  reviews: IReview[];
  propertyId: string;
}

const ReviewContainer: React.FC<IProps> = ({ reviews, propertyId }) => {
  const [showModalReview, setShowModalReview] = useState<boolean>(false);

  return (
    <div className="relative w-full">
      <p className="text-semibold pb-2">Các đánh giá gần đây</p>
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Autoplay]}
      >
        {reviews.map((item, index) => (
          <SwiperSlide key={index}>
            {
              <ReviewItem
                id={item.id}
                rating={item.rating}
                text={item.text}
                createdAt={item.createdAt}
                user={item.user}
              />
            }
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowModalReview(true)}
          className="border-[1px] border-gray-400 rounded-3xl py-2 px-5 text-blue-600 font-semibold hover:bg-blue-200"
        >
          See more reviews
        </button>
      </div>

      {showModalReview && (
        <ReviewModal
          onShowModalReview={setShowModalReview}
          propertyId={propertyId}
        />
      )}
    </div>
  );
};

export default ReviewContainer;
