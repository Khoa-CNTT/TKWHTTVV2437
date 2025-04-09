"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaCheck } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const data = [1, 2, 3, 4, 5];

const InforRoomCheckout = () => {
  return (
    <div className="w-full">
      <div>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Navigation]}
        >
          {data?.map((item, index) => (
            <div>
              <SwiperSlide key={index}>
                <div key={index}>
                  <img
                    className="object-cover rounded-lg w-full h-[300px]"
                    src={
                      "https://cf.bstatic.com/xdata/images/hotel/square600/489013625.webp?k=4bcd3314e69b15662f04a7099fa9d4b00ddd40f243ce9098583c79045becce1f&o="
                    }
                    alt="anh"
                  />
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>
      </div>

      <div className="border-b-[1px] border-x-[1px] rounded-b-md border-gray-300 px-6 py-8">
        <h4 className="font-semibold">
          Secluded 3 Acres on the White River. Custom
        </h4>
        <p>Hội An</p>
        <p className="mt-3">
          <span className="font-semibold">10/10 Exceptional</span>
          <span className="text-gray-500"> (2 đánh giá)</span>
        </p>

        <div className="p-4 border-[1px] border-green-700 rounded-lg my-8 text-green-700 flex items-center gap-4">
          <FaCheck size={20} />
          <p className="text-sm">
            Bạn có gu thẩm mỹ tốt! Đặt ngay trước khi người khác lấy nó.
          </p>
        </div>

        <div>
          <span className="text-sm text-gray-500">Check In</span>
          <p>Fri, 2 May, 4:00 pm</p>
        </div>

        <div className="mt-3">
          <span className="text-sm text-gray-500">Check In</span>
          <p>Fri, 2 May, 4:00 pm</p>
        </div>

        <div className="mt-3">
          <span className="text-sm text-gray-500">Số khách</span>
          <p>6 khách</p>
        </div>

        <div className="mt-4 border-t-[1px] border-gray-300 pt-4">
          <div className="flex justify-between items-center">
            <p>200000 x 2 đêm</p>
            <p>400000</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Giá</p>
            <p>200000 / đêm</p>
          </div>
        </div>

        <div className="mt-3 border-t-[1px] border-gray-300 pt-4 flex justify-between items-center">
          <p className="font-semibold">Tổng</p>
          <p className="text-lg font-semibold">400000</p>
        </div>
      </div>
    </div>
  );
};

export default InforRoomCheckout;
