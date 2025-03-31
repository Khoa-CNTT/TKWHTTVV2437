"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import InforRomItem from "../room/InforRomItem";
import TitleContainer from "./TitleContainer";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const data = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

interface IProps {
  rooms: [];
}

const ContainerRoom: React.FC<IProps> = ({ rooms }) => {
  console.log({ rooms });
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
          modules={[Navigation, Autoplay]}
        >
          {rooms.map((item: any, index) => (
            <SwiperSlide>
              <InforRomItem key={index} title={item.name} price={item.price} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContainerRoom;
