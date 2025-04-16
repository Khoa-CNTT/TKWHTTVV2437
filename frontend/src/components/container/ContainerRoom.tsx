"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import InforRomItem from "../room/InforRomItem";
import TitleContainer from "./TitleContainer";
import { IRoom } from "@/app/types/room";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface IProps {
  rooms: [];
}

const ContainerRoom: React.FC<IProps> = ({ rooms }) => {
  return (
    <div className="pt-4 mt-8">
      <TitleContainer
        title="Các Homestay nổi bật"
        description="Show deals for: May 2 - May 4"
      />

      <div className="mt-4">
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
          {rooms !== undefined &&
            rooms.map((item: IRoom, index: number) => (
              <SwiperSlide key={index}>
                <InforRomItem
                  image={item.images[0]?.image}
                  key={index}
                  title={item.name}
                  price={item.price}
                  location={item.property.city.name}
                  quantityReview={item.reviewCount}
                  rating={item.averageRating || 0}
                  slug={item.slug}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContainerRoom;
