'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import TitleContainer from './TitleContainer';
import RoomItemRecomend from "../room/RoomItemRecomend";

const data = [
  1, 2, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13
]

const ContainerRecomend = () => {
  return (
    <div>
      <TitleContainer title="Đề xuất cho bạn" />

      <Swiper
        spaceBetween={15}
        slidesPerView={4}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Autoplay]}
      >
        {data.map((item, index) => (
          <SwiperSlide>
            <RoomItemRecomend key={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ContainerRecomend;