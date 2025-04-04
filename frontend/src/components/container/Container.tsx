"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import TitleContainer from "./TitleContainer";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const data = [
  {
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
    title: "New York",
  },
  {
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/981517.jpg?k=2268f51ad34ab94115ea9e42155bc593aa8d48ffaa6fc58432a8760467dc4ea6&o=",
    title: "New York",
  },
  {
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
    title: "New York",
  },
  {
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
    title: "New York",
  },
  {
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
    title: "New York",
  },
];

const Container = () => {
  return (
    <div className="container mx-auto pt-8">
      <TitleContainer title="Các thành phố tiêu biểu" />

      <div className="mt-4">
        <Swiper
          spaceBetween={10}
          slidesPerView={5}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
        >
          {data.map((item, index) => (
            <SwiperSlide>
              <div className="relative" key={index}>
                <img
                  className="min-h-[300px] object-fit rounded-lg"
                  src={item.image}
                  alt=""
                />
                <p className="text-gray-800 text-lg font-semibold absolute bottom-0 left-[10px] text-white">
                  {item.title}
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
