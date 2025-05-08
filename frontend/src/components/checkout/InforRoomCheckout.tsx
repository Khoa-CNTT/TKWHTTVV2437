"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaCheck } from "react-icons/fa6";
import { useCheckoutContext } from "@/app/contexts/CheckoutContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import apisReview from "@/apis/review";
import { IProperty } from "@/app/types/property";
import { IRoom } from "@/app/types/room";

interface IReview {
  averageRating: number;
  reviewCount: number;
}

interface IProps {
  property: IProperty | null;
  room: IRoom | null;
  code: string;
}

const InforRoomCheckout: React.FC<IProps> = ({ property, room, code }) => {
  // const { propertyId, startDate, endDate, guest } = useCheckoutContext(); // Lấy hàm setRoomId từ context
  const { propertyId, startDate, endDate } = useCheckoutContext();

  const [review, setReview] = useState<IReview>();

  useEffect(() => {
    const fetchReview = async () => {
      const reviewData = await apisReview.getReviewByProperty(
        String(propertyId)
      );
      if (reviewData.data) {
        setReview(reviewData.data);
      }
    };

    fetchReview();
  }, [propertyId]);

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
          {property?.images?.map((item, index) => (
            <div key={index}>
              <SwiperSlide>
                <div key={index}>
                  <img
                    className="object-cover rounded-lg w-full h-[300px]"
                    src={item?.image}
                    alt="anh"
                  />
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>
      </div>

      <div className="border-b-[1px] border-x-[1px] rounded-b-md border-gray-300 px-6 py-8">
        <h4 className="font-semibold text-xl mt-2 mb-4 border p-4 border-gray-300 bg-yellow-50 rounded-lg ">
          Mã xác nhận: {code}
        </h4>
        <h4 className="font-semibold">{property?.name}</h4>
        <h3 className="font-medium">{room?.name}</h3>
        <p className="mt-2">{property?.propertyAddress?.city}</p>
        <p className="mt-3">
          <span className="font-semibold">
            {review?.averageRating || 0}/10 Exceptional
          </span>
          <span className="text-gray-500">
            {" "}
            ({review?.reviewCount} đánh giá)
          </span>
        </p>

        <div className="p-4 border-[1px] border-green-700 rounded-lg my-8 text-green-700 flex items-center gap-4">
          <FaCheck size={20} />
          <p className="text-sm">
            Bạn có gu thẩm mỹ tốt! Đặt ngay trước khi người khác lấy nó.
          </p>
        </div>

        <div>
          <span className="text-sm text-gray-500">Check In</span>
          <p>{startDate?.format("DD/MM/YYYY")} 14:00</p>
        </div>

        <div className="mt-3">
          <span className="text-sm text-gray-500">Check In</span>
          <p>{endDate?.format("DD/MM/YYYY")} 12:00</p>
        </div>

        <div className="mt-3">
          <span className="text-sm text-gray-500">Số khách</span>
          <p>{room?.maxPerson} khách</p>
        </div>

        <div className="mt-4 border-t-[1px] border-gray-300 pt-4">
          <div className="flex justify-between items-center">
            <p>
              {room?.price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}{" "}
              x{" "}
              {startDate &&
                endDate &&
                Math.abs(startDate?.diff(endDate, "day"))}{" "}
              đêm
            </p>
            <p>
              {startDate &&
                endDate &&
                room?.price &&
                Number(
                  room?.price * Math.abs(startDate?.diff(endDate, "day"))
                ).toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p>Giá</p>
            <p>
              {room?.price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
              / đêm
            </p>
          </div>
        </div>

        <div>
          <div className="mt-3 border-t-[1px] border-gray-300 pt-4 flex justify-between items-center">
            <p className="font-semibold">Tổng</p>
            <p className="text-lg font-semibold">
              {startDate &&
                endDate &&
                room?.price &&
                Number(
                  room?.price * Math.abs(startDate?.diff(endDate, "day"))
                ).toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
            </p>
          </div>

          {/* <div className="mt-3 border-t-[1px] border-gray-300 pt-4 flex justify-between items-center">
            <p className="font-semibold">Còn lại</p>
            <p className="text-lg font-semibold">
              {startDate &&
                endDate &&
                room?.price &&
                room?.deposit !== null &&
                Number(
                  room?.price * Math.abs(startDate?.diff(endDate, "day")) -
                    Number(room?.deposit)
                ).toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InforRoomCheckout;
