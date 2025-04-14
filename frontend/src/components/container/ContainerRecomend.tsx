"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import TitleContainer from "./TitleContainer";
import RoomItemRecomend from "../room/RoomItemRecomend";
import { IProperty } from "@/app/types/property";

interface IProps {
  properties: [];
}

const ContainerRecomend: React.FC<IProps> = ({ properties }) => {
  return (
    <div>
      <TitleContainer title="Đề xuất cho bạn" />

      <Swiper
        spaceBetween={15}
        slidesPerView={4}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
      >
        {properties.map((item: IProperty, index: number) => (
          <SwiperSlide key={index}>
            <RoomItemRecomend
              key={index}
              images={item.images}
              title={item.name}
              price={item.price}
              city={item.city.name}
              quantityReview={item.reviewCount}
              rating={item.averageRating || 0}
              slug={item.slug}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContainerRecomend;
