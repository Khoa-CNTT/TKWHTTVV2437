"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import TitleContainer from "./TitleContainer";
import { IProperty } from "@/app/types/property";
import InforRomItem from "../room/InforRomItem";

interface IProps {
  properties: IProperty[];
}

const ContainerRecomendCity: React.FC<IProps> = ({ properties }) => {
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
        {properties?.map((item: IProperty, index: number) => (
          <SwiperSlide key={index}>
            <InforRomItem
              key={index}
              image={item?.images[0]?.image}
              title={item?.name}
              price={item?.price}
              city={item?.propertyAddress?.city}
              quantityReview={item?.reviewCount}
              rating={item?.averageRating || 0}
              slug={item?.slug}
              advertising={Number(item?.advertising) || 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContainerRecomendCity;
