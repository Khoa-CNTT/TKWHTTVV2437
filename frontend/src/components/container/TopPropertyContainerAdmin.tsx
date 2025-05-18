"use client";

import apisProperty from "@/apis/property";
import { IProperty } from "@/app/types/property";
import clsx from "clsx";
import { useState, useEffect } from "react";

const TopPropertyContainerAdmin = () => {
  const [properties, setProperties] = useState<IProperty[]>([]);

  useEffect(() => {
    const fetchDataProperty = async () => {
      const response = await apisProperty.getListTop10Rating();

      setProperties(response?.data);
    };

    fetchDataProperty();
  }, []);

  console.log({ properties });

  return (
    <div className="w-full">
      <div className="p-10">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">
            Top Homestay/Resort được đánh giá tốt nhất
          </h1>
        </div>

        <div className="overflow-hidden mt-4 rounded-xl">
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
              <tr>
                <th className="px-4 py-3 text-left">Top</th>
                <th className="px-4 py-3 text-left">Ảnh</th>
                <th className="pl-4 py-3 text-left">Tên</th>
                <th className="px-4 py-3 text-left ">Địa chỉ</th>
                <th className="px-4 py-3 text-left ">Số đánh giá</th>
                <th className="px-4 py-3 text-left ">Điểm đánh giá</th>
                <th className="px-4 py-3 text-left ">Trạng thái</th>
              </tr>
            </thead>
            <tbody className=" text-[-14] font-semibold">
              {properties?.map((item, index) => (
                <tr
                  key={item?.id}
                  className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-4 py-5"># {index + 1}</td>
                  <td className="pl-4">
                    <img
                      className="w-[50px] h-[50px] object-cover rounded-md"
                      src={item?.images[0]?.image}
                    ></img>
                  </td>
                  <td className="px-4 py-5">
                    {item?.name?.length <= 35
                      ? item?.name
                      : item?.name?.slice(0, 35) + "..."}
                  </td>
                  <td className="px-4 py-5">{item?.propertyAddress?.city}</td>
                  <td className="pl-4 py-5">{item?.reviewCount}</td>
                  <td className="px-4 py-5 flex items-center gap-2">
                    {item?.averageRating}
                  </td>
                  <td
                    className={clsx(
                      "px-4 py-5",
                      item?.status === "active"
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {item?.status === "active"
                      ? "Hoạt động"
                      : "Không hoạt động"}
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

export default TopPropertyContainerAdmin;
