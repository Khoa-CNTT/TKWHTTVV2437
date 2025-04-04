"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

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

const RoomItemRecomend = () => {
  return (
    <div className="mt-2">
      <div className="border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Navigation, Autoplay]}
        >
          {data.map((item, index) => (
            <SwiperSlide>
              <img
                className="min-h-[250px] object-fit rounded-t-xl"
                src="https://images.trvl-media.com/lodging/20000000/19110000/19107300/19107268/139b07c5.jpg?impolicy=fcrop&w=600&h=400&p=1&q=high"
                alt="anh"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="p-2">
          <h4 className="text-[16px] font-semibold">
            Goergeous RiverBluff View of the White River + WIFI
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-green-700 font-medium text-sm text-white px-1 rounded-md">
              9.8
            </span>
            <p className="text-sm">
              Exceptional <span>(6 reviews)</span>
            </p>
          </div>
          <p className="text-sm mt-1">Calico Rock, AR</p>
          <p className="text-md font-semibold mt-2 text-right">$150</p>
          <p className="text-[12px] text-right">per night</p>
          <p className="text-[12px] text-right">$350 total</p>
        </div>
      </div>
    </div>
  );
};

export default RoomItemRecomend;
