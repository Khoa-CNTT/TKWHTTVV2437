"use client";

import { useState, useEffect, useRef } from "react";
import { OutlinedInput } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useAuth } from "@/app/contexts/AuthContext";
import { IoPersonSharp } from "react-icons/io5";
import { useDebounce } from "use-debounce";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { FaChevronDown } from "react-icons/fa";

import apisProperty from "@/apis/property";
import { IRoom } from "@/app/types/room";
import apisRoom from "@/apis/room";
import apisRoomAvailability from "@/apis/roomAvailability";

const ManagerStatus = () => {
  const [valueSearch, setValueSearch] = useState<string>("");
  const [showDeleteText, setShowDeleteText] = useState<boolean>(false);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const { user } = useAuth();
  const [propertyId, setPropertyId] = useState<string>("");
  const [text] = useDebounce(valueSearch, 500);
  const [roomAvailabilities, setRoomAvailabilities] = useState<
    { id: string; idRoom: string; blocked_quantity: number }[]
  >([]);
  const [value, setValue] = useState<Dayjs>(dayjs());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchPropertyId = async (id: string) => {
      const response = await apisProperty.getPropertyIdByUserId(id);

      if (response?.data) {
        setPropertyId(response.data.id);
      }
    };

    if (user?.id) {
      fetchPropertyId(user?.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query: { text?: string } = {};
        if (text.length > 0) {
          query.text = text;
        }

        const [roomsResponse] = await Promise.all([
          apisRoom.getListRoomByPropertyId(propertyId, query), // Gọi API lấy danh sách phòng
        ]);

        setRooms(roomsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (propertyId) {
      fetchData();
    }
  }, [propertyId, text]);

  useEffect(() => {
    const fetchDataRoomAvailability = async () => {
      const response =
        await apisRoomAvailability.getListRoomAvailabilityBypropertyId(
          propertyId,
          {
            date: value?.format("YYYY/MM/DD"),
          }
        ); // Gọi API lấy tình trạng phòng

      setRoomAvailabilities(response.data);
    };

    fetchDataRoomAvailability();
  }, [propertyId, value]);

  useEffect(() => {
    if (valueSearch.length > 0) {
      setShowDeleteText(true);
    } else {
      setShowDeleteText(false);
    }
  }, [valueSearch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full">
        <div className="p-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Thông tin tình trạng phòng</h1>
          </div>
          <div className="flex justify-between items-end mt-8">
            <div className="w-[27%] relative">
              <OutlinedInput
                placeholder="Please enter text"
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
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

            <div>
              <div className="flex flex-col gap-1 w-[170px]">
                <label className="font-semibold text-md">Chọn ngày</label>
                <div ref={calendarRef} className="relative">
                  <button
                    className="px-6 py-2 border-gray-300 border rounded-md flex items-center justify-between gap-4"
                    onClick={() => setShowCalendar((prev) => !prev)}
                  >
                    {value?.format("DD/MM/YYYY")}

                    <FaChevronDown />
                  </button>

                  {showCalendar && (
                    <div className="absolute bottom-100 right-0 bg-white shadow-lg">
                      <DateCalendar
                        value={value}
                        onChange={(newValue) => {
                          setValue(newValue);
                          setShowCalendar(false); // Đóng lịch sau khi chọn ngày
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden mt-4 rounded-xl">
            <table className="min-w-full text-black">
              <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
                <tr>
                  <th className="px-4 py-3 text-left">Mã phòng</th>
                  <th className="pl-4 py-3 text-left">Ảnh</th>
                  <th className="px-4 py-3 text-left ">Tên</th>
                  <th className="px-4 py-3 text-left ">Đặt / số lượng</th>
                  <th className="px-4 py-3 text-left ">Sức chứa</th>
                  <th className="px-4 py-3 text-left ">Giá</th>
                </tr>
              </thead>
              <tbody className=" text-[-14] font-semibold">
                {rooms.map((item) => (
                  <tr
                    key={item?.id}
                    className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  >
                    <td className="px-4 py-5">{item?.code}</td>
                    <td className="pl-4">
                      <img
                        className="w-[50px] h-[50px] object-cover rounded-md"
                        src={item?.images[0]?.image}
                      ></img>
                    </td>
                    <td className="pl-4 py-5">{item.name}</td>
                    <td className="pl-4 py-5">{`${roomAvailabilities.find((subItem) => subItem.idRoom === item.id)?.blocked_quantity || 0}/${item.quantity}`}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default ManagerStatus;
