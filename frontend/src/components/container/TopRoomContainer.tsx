"use client";

import apisRoom from "@/apis/room";
import { useState, useEffect } from "react";

interface IProps {
  propertyId: string;
}

interface IRevenueRoom {
  id: string;
  name: string;
  price: number;
  code: string;
  revenue: number;
  images: {
    image: string;
    id: string;
  }[];
  reservationCount: number;
}

const TopRoomContainer: React.FC<IProps> = ({ propertyId }) => {
  const [rooms, setRooms] = useState<IRevenueRoom[]>([]);

  useEffect(() => {
    const fetchDataRoomRevenue = async () => {
      const response = await apisRoom.getTopRevenueRoomByPropertyId(propertyId);

      setRooms(response.data);
    };

    fetchDataRoomRevenue();
  }, [propertyId]);

  return (
    <div className="w-full">
      <div className="p-10">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">Xếp hạng loại phòng theo doanh thu</h1>
        </div>

        <div className="overflow-hidden mt-4 rounded-xl">
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
              <tr>
                <th className="px-4 py-3 text-left">Top</th>
                <th className="px-4 py-3 text-left">Mã phòng</th>
                <th className="pl-4 py-3 text-left">Ảnh</th>
                <th className="px-4 py-3 text-left ">Tên</th>
                <th className="px-4 py-3 text-left ">Số lượng đặt</th>
                <th className="px-4 py-3 text-left ">Giá</th>
                <th className="px-4 py-3 text-left ">Doanh thu</th>
              </tr>
            </thead>
            <tbody className=" text-[-14] font-semibold">
              {rooms.map((item, index) => (
                <tr
                  key={item?.id}
                  className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-4 py-5"># {index + 1}</td>
                  <td className="px-4 py-5">{item?.code}</td>
                  <td className="pl-4">
                    <img
                      className="w-[50px] h-[50px] object-cover rounded-md"
                      src={item?.images[0]?.image}
                    ></img>
                  </td>
                  <td className="pl-4 py-5">{item.name}</td>
                  <td className="px-4 py-5 flex items-center gap-2">
                    {item.reservationCount}
                  </td>
                  <td className="px-4 py-5">
                    {item?.price?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                    / đêm
                  </td>
                  <td className="px-4 py-5 flex items-center gap-2">
                    {item?.revenue?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    }) || "0 VND"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopRoomContainer;
