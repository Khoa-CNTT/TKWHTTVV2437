"use client";

import { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import apisRoom from "@/apis/room";
import { IRoom } from "@/app/types/room";

const ManagerRoom = () => {
  const [valueSearch, setValueSearch] = useState<string>("");
  const [showDeleteText, setShowDeleteText] = useState<boolean>(false);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    const fetchDataRoom = async () => {
      const response = await apisRoom.getListRoomByPropertyId("1");

      if (response?.data) {
        setRooms(response.data);
      }
    };

    fetchDataRoom();
  }, []);

  useEffect(() => {
    if (valueSearch.length > 0) {
      setShowDeleteText(true);
    } else {
      setShowDeleteText(false);
    }
  }, [valueSearch]);

  return (
    <div className="w-full">
      <div className="p-10">
        <h1 className="text-2xl font-bold ">Danh sách các phòng</h1>
        <div className="flex justify-between items-center mt-8">
          <div className="w-[27%] relative">
            <OutlinedInput
              placeholder="Please enter text"
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value.trim())}
              sx={{
                width: "100%", // Tùy chỉnh chiều rộng
                borderRadius: "10px", // Bo góc
              }}
              inputProps={{
                style: {
                  padding: "12px 30px 12px 35px", // Padding trên/dưới và trái/phải
                },
              }}
            />

            <IoSearch
              size={22}
              className="absolute top-[50%] left-[7px] translate-y-[-50%] text-gray-600"
            />

            {showDeleteText && (
              <IoMdClose
                onClick={() => setValueSearch((prev) => "")}
                size={22}
                className="absolute top-[50%] translate-y-[-50%] text-gray-600 right-[10px] cursor-pointer z-10"
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-500 font-semibold rounded-xl bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-100">
              All Booking
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-500 font-semibold rounded-xl bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-100">
              Loại phòng
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-500 font-semibold rounded-xl bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-100">
              Trạng thái
              <span>
                <FaCaretDown />
              </span>
            </button>
          </div>
        </div>
        <div className="overflow-hidden mt-4 rounded-xl">
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-3 text-left">Mã phòng</th>
                <th className="pl-4 py-3 text-left">Ảnh</th>
                <th className="px-4 py-3 text-left ">Tên</th>
                <th className="px-4 py-3 text-left ">Số lượng phòng</th>
                <th className="px-4 py-3 text-left ">Sức chứa</th>
                <th className="px-4 py-3 text-left ">Giá</th>
                <th className="px-4 py-3 text-left ">Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody className=" text-[-14] font-semibold">
              {rooms.map((item) => (
                <tr
                  key={item?.id}
                  className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-4 py-5">
                    <input type="checkbox" />
                  </td>
                  <td className="px-4 py-5">{item?.code}</td>
                  <td className="pl-4">
                    <img
                      className="w-[50px] h-[50px] object-cover rounded-md"
                      src={item?.images[0].image}
                    ></img>
                  </td>
                  <td className="pl-4 py-5">{item.name}</td>
                  <td className="pl-4 py-5">{item.quantity}</td>
                  <td className="px-4 py-5 flex items-center gap-2">
                    {Array(item?.maxPerson)
                      .fill(0)
                      .map((_, index) => (
                        <IoPersonSharp key={index} size={20} />
                      ))}
                  </td>
                  <td className="px-4 py-5">
                    {item.price.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                    / đêm
                  </td>
                  <td className="px-4 py-5 ">{item?.status}</td>
                  <td className="flex items-center gap-4 justify-end mr-4">
                    <FaEdit size={23} className="cursor-pointer" />
                    <MdDelete size={23} className="cursor-pointer" />
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

export default ManagerRoom;
