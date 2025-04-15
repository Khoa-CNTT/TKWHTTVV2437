"use client";
import React, { useEffect } from "react";
import { IoFastFood } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { IoBed } from "react-icons/io5";
import { FaCity } from "react-icons/fa";
import AmenityRoomContainer from "./AmenityRoomContainer";
import { IImage } from "@/app/types/property";
import { useCheckoutContext } from "@/app/contexts/CheckoutContext";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface IProps {
  amenities: {
    icon: string; // Tên icon (key trong `iconMap`)\
    name: string; // Tên tiện ích
  }[];
  id: string;
  name: string;
  images: IImage[];
  maxPerson: number;
  price: number;
  propertyId: string;
}

const ListRoomContainer: React.FC<IProps> = ({
  amenities,
  id,
  name,
  images,
  maxPerson,
  price,
  propertyId,
}) => {
  const { setPropertyId, setRoomId, setStartDate, setEndDate } =
    useCheckoutContext();
  const router = useRouter();

  const handleCheckOut = () => {
    console.log("propertyId", propertyId);
    // setStartDate(selectedDateRange[0] || null);
    // setEndDate(selectedDateRange[1] || null);
    setRoomId(id); // Gọi hàm setRoomId với giá trị "roomId"
    setPropertyId(propertyId); // Gọi hàm setRoomId với giá trị "roomId"
    router.push("/checkout"); // Chuyển hướng đến trang checkout
  };

  // Delete localStorage when component unmounts
  useEffect(() => {
    // localStorage.removeItem("propertyId");
    // localStorage.removeItem("roomId");
    // localStorage.removeItem("startDate");
    // localStorage.removeItem("endDate");
    setPropertyId("");
    setRoomId("");
    setStartDate(dayjs(new Date()));
    setEndDate(dayjs(new Date().setDate(new Date().getDate() + 2)));
  }, []);

  return (
    <div className="shadow-md bg-white border-gray-300 rounded-md p-4 mt-2">
      <h2 className="mb-4 font-semibold text-lg">{name}</h2>
      <div className="flex gap-4">
        <div className="w-[30%]">
          <img className="rounded-md" src={images[0]?.image}></img>

          <div>
            <div className="flex items-center gap-2 mt-2">
              <IoBed size={24} />
              <p className="font-semibold">{maxPerson} Giường</p>
            </div>

            <AmenityRoomContainer amenities={amenities} />
          </div>
        </div>

        <div className="w-[80%] border-[1px] rounded-md  p-4 flex flex-col justify-between">
          <div className="flex">
            <div className="w-[70%]">
              <p className="font-semibold">Tóm tắt</p>
              <p className="flex items-center gap-2 mt-4">
                <IoFastFood size={20} />
                <span className="text-sm">Bao gồm 2 bữa sáng tuyệt vời</span>
              </p>

              <p className="flex items-center gap-2 mt-4">
                <IoFastFood size={20} />
                <span className="text-sm">Bao gồm 2 bữa sáng tuyệt vời</span>
              </p>

              <p className="flex items-center gap-2 mt-4">
                <IoFastFood size={20} />
                <span className="text-sm">Bao gồm 2 bữa sáng tuyệt vời</span>
              </p>
            </div>

            <div className="w-[30%] border-l-[1px] border-gray-300 pl-4">
              <p className="text-center font-semibold">Sức chứa</p>
              <div className="mt-4 flex items-center gap-2 justify-center">
                {Array(maxPerson)
                  .fill(0)
                  .map((_, index) => (
                    <IoPersonSharp key={index} size={20} />
                  ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-4">
            <p className="font-semibold text-md">
              Giá:{" "}
              {price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <button
              onClick={handleCheckOut}
              className="text-white font-medium bg-blue-700 text-sm px-6 py-2 rounded-md ml-4 hover:opacity-90 transition-all duration-200"
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRoomContainer;
