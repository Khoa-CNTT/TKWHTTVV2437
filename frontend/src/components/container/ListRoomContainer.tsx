"use client";

import React, { useEffect, useState } from "react";
import { IoFastFood } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { IoBed } from "react-icons/io5";
import { FaCity } from "react-icons/fa";
import AmenityRoomContainer from "./AmenityRoomContainer";
import { IImage } from "@/app/types/property";
import { useCheckoutContext } from "@/app/contexts/CheckoutContext";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ISummary } from "@/app/types/summary";

// import icon summary
import { LuSalad } from "react-icons/lu";
import { MdMoneyOff } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { SlEnergy } from "react-icons/sl";
import { FaCheckCircle } from "react-icons/fa";
import apisRoom from "@/apis/room";
import { IRoom } from "@/app/types/room";
import apisRoomAvailability from "@/apis/roomAvailability";
import clsx from "clsx";

interface IProps {
  propertyId: string;
}

// set icon sumary
const iconSumary: { [key: string]: JSX.Element } = {
  LuSalad: <LuSalad />,
  MdMoneyOff: <MdMoneyOff />,
  FaRegCreditCard: <FaRegCreditCard />,
  SlEnergy: <SlEnergy />,
  FaCheckCircle: <FaCheckCircle />,
};

const ListRoomContainer: React.FC<IProps> = ({ propertyId }) => {
  const {
    setPropertyId,
    setRoomId,
    setStartDate,
    setEndDate,
    startDate,
    endDate,
  } = useCheckoutContext();
  const router = useRouter();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [listRoomAvailability, setListRoomAvailability] = useState<
    { id: string; status: boolean }[]
  >([]);

  useEffect(() => {
    const fetchListRoom = async () => {
      const response = await apisRoom.searchListRoomForBooking(propertyId);

      if (response.data) {
        setRooms(response.data);
      }
    };

    fetchListRoom();
  }, [propertyId]);

  useEffect(() => {
    const fetchDataRoomAvailability = async () => {
      const response =
        await apisRoomAvailability.checkRoomAvailabilityByPropertyId({
          propertyId,
          startDate: `${dayjs(startDate).format("YYYY-MM-DD")} 14:00:00`,
          endDate: `${dayjs(endDate).format("YYYY-MM-DD")} 12:00:00`,
        });

      if (response.data) {
        setListRoomAvailability(response.data);
      }
    };

    fetchDataRoomAvailability();
  }, [startDate, endDate]);

  const handleCheckOut = (id: string) => {
    console.log("propertyId", propertyId);
    setRoomId(id); // Gọi hàm setRoomId với giá trị "roomId"
    setPropertyId(propertyId); // Gọi hàm setRoomId với giá trị "roomId"
    router.push("/checkout"); // Chuyển hướng đến trang checkout
  };

  // Delete localStorage when component unmounts
  useEffect(() => {
    setPropertyId("");
    setRoomId("");
    setStartDate(dayjs(new Date()));
    setEndDate(dayjs(new Date().setDate(new Date().getDate() + 2)));
  }, []);

  return (
    <div>
      {rooms.map((item: IRoom) => (
        <div
          key={item.id}
          className="shadow-md bg-white border-gray-300 rounded-md p-4 mt-2"
        >
          <h2 className="mb-4 font-semibold text-lg">{item.name}</h2>
          <div className="flex gap-4">
            <div className="w-[30%]">
              <img
                alt="anh"
                className="rounded-md w-full h-[140px] object-cover"
                src={item.images[0]?.image}
              ></img>

              <div>
                <div className="flex items-center gap-2 mt-2">
                  <IoBed size={24} />
                  <p className="font-semibold">{item.maxPerson} Giường</p>
                </div>

                <AmenityRoomContainer amenities={item?.amenities} />
              </div>
            </div>

            <div className="w-[80%] border-[1px] rounded-md  p-4 flex flex-col justify-between">
              <div className="flex">
                <div className="w-[70%]">
                  <p className="font-semibold">Tóm tắt</p>
                  {item.summaries.map((summary: ISummary) => (
                    <p
                      key={summary.id}
                      className="flex items-center gap-2 mt-2"
                    >
                      {iconSumary[summary.icon]}
                      <span className="text-sm">{summary.name}</span>
                    </p>
                  ))}
                </div>

                <div className="w-[30%] border-l-[1px] border-gray-300 pl-4">
                  <p className="text-center font-semibold">Sức chứa</p>
                  <div className="mt-4 flex items-center gap-2 justify-center">
                    {Array(item.maxPerson)
                      .fill(0)
                      .map((_, index) => (
                        <IoPersonSharp key={index} size={20} />
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <div>
                  <div className="flex items-center">
                    <p className="font-semibold text-md">
                      Giá:{" "}
                      {item?.price?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <button
                      onClick={() => {
                        if (
                          listRoomAvailability.some(
                            (subItem) =>
                              subItem.id === item.id && subItem.status === true
                          )
                        ) {
                          handleCheckOut(item.id);
                        }
                      }}
                      className={clsx(
                        "text-white font-medium bg-blue-700 text-sm px-6 py-2 rounded-md ml-4 hover:opacity-90 transition-all duration-200",
                        {
                          "opacity-50 cursor-not-allowed":
                            listRoomAvailability.some(
                              (subItem) =>
                                subItem.id === item.id &&
                                subItem.status === false
                            ),
                        }
                      )}
                    >
                      Đặt ngay
                    </button>
                  </div>

                  {listRoomAvailability.some(
                    (subItem) =>
                      subItem.id === item.id && subItem.status === false
                  ) && (
                    <p className="text-[11px] font-semibold text-red-500 flex justify-end mt-1">
                      Phòng đã được đặt hết
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListRoomContainer;
