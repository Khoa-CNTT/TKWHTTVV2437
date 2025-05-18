"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";

import TitleContainer from "./TitleContainer";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface IProps {
  cities: {
    image: string;
    name: string;
  }[];
}

const Container: React.FC<IProps> = ({ cities }) => {
  const router = useRouter();

  return (
    <div className="container mx-auto pt-8">
      <TitleContainer title="Các thành phố tiêu biểu" />

      <div className="mt-4">
        <Swiper
          spaceBetween={10}
          slidesPerView={6}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
        >
          {cities?.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => router.push("/search?city=" + item.name)}
                className="relative cursor-pointer"
                key={index}
              >
                <img
                  className="min-h-[170px] object-fit rounded-lg"
                  src={item?.image}
                  alt=""
                />
                <p className="text-lg font-semibold absolute bottom-0 left-[10px] text-white">
                  {item.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Container;
