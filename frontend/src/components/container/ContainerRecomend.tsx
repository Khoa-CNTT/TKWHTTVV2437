"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import moment from "moment";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import TitleContainer from "./TitleContainer";
import RoomItemRecomend from "../room/RoomItemRecomend";
import { IProperty } from "@/app/types/property";

// interface IProps {
//   properties: [];
// }

interface IData {
  propertyId: string;
  avgRating: string;
  reviewCount: number;
  image: string;
  name: string;
  advertising: number;
  city: string;
  price: string;
  slug: string;
  expiredAd: string;
}

const ContainerRecomend = () => {
  const [properties, setProperties] = useState<IData[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("dataRecommend");
    if (storedData) {
      setProperties(JSON.parse(storedData));
    }
  }, []);

  if (properties.length === 0) {
    return <div></div>;
  }

  return (
    <div className="mt-8 z-0">
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
        {properties?.map((item: IData, index: number) => (
          <SwiperSlide key={index}>
            <RoomItemRecomend
              key={index}
              image={item?.image}
              title={item?.name}
              price={Number(item?.price)}
              city={item?.city}
              quantityReview={item.reviewCount}
              rating={item?.avgRating}
              slug={item.slug}
              advertising={
                moment(item.expiredAd) > moment()
                  ? Number(item?.advertising)
                  : 0
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContainerRecomend;
