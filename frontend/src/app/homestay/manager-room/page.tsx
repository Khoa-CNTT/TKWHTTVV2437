"use client";

import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import apisProperty from "@/apis/property";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useDebounce } from "use-debounce";
import MessageNotFound from "@/components/Item/MessageNotFound";

const ManagerRoom = () => {
  const [valueSearch, setValueSearch] = useState<string>("");
  const [showDeleteText, setShowDeleteText] = useState<boolean>(false);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [propertyId, setPropertyId] = useState<string>("");
  const { user } = useAuth();
  const [check, setCheck] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("0");
  const [text] = useDebounce(valueSearch, 500);

  const router = useRouter();

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
    const fetchDataRoom = async () => {
      const query: { text?: string; status?: string } = {};
      if (text.length > 0) {
        query.text = text;
      }

      if (status !== "0") {
        query.status = status;
      }
      const response = await apisRoom.getListRoomByPropertyId(
        propertyId,
        query
      );

      if (response?.data) {
        setRooms(response.data);
      }
    };

    fetchDataRoom();
  }, [propertyId, check, text, status]);

  useEffect(() => {
    if (valueSearch.length > 0) {
      setShowDeleteText(true);
    } else {
      setShowDeleteText(false);
    }
  }, [valueSearch]);

  const handleChangeStatus = async (id: string, status: string) => {
    if (status === "active") {
      try {
        const response = await apisRoom.updateStatusRoom(id, "inactive");

        if (response.status === "OK") {
          toast.success("Cập nhật trạng thái thành công!");
          setCheck((prev) => !prev);
        } else {
          toast.error("Cập nhật trạng thái thất bại!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Cập nhật trạng thái thất bại!");
      }
    } else {
      try {
        const response = await apisRoom.updateStatusRoom(id, "active");

        if (response.status === "OK") {
          toast.success("Cập nhật trạng thái thành công!");
          setCheck((prev) => !prev);
        } else {
          toast.error("Cập nhật trạng thái thất bại!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Cập nhật trạng thái thất bại!");
      }
    }
  };

  useEffect(() => {
    let newRooms = rooms;

    if (valueSearch.length > 0) {
      newRooms = rooms.filter((item) =>
        item.name.toLowerCase().includes(valueSearch.toLowerCase())
      );
    }

    setRooms(newRooms);
  }, [valueSearch]);

  return (
    <div className="w-full">
      <div className="p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Danh sách các phòng</h1>

          <Link
            className="bg-green-700 py-2 px-5 text-white font-semibold rounded-md cursor-pointer hover:opacity-90"
            href={"/homestay/manager-room/create"}
          >
            Tạo phòng mới
          </Link>
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
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1 w-[170px]">
              <label className="font-semibold text-md">Trạng thái</label>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "10px", // Tùy chỉnh padding
                  },
                }}
              >
                <MenuItem value={"0"}>Chọn trạng thái</MenuItem>
                <MenuItem value={"active"}>Hoạt động</MenuItem>
                <MenuItem value={"inactive"}>Không hoạt động</MenuItem>
              </Select>
            </div>
          </div>
        </div>
        <div className="overflow-hidden mt-4 rounded-xl">
          <table className="min-w-full relative text-black">
            <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
              <tr>
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
            {rooms.length === 0 ? (
              <MessageNotFound />
            ) : (
              <tbody className=" text-[-14] font-semibold">
                {rooms.map((item) => (
                  <tr
                    onClick={() =>
                      router.push(`manager-room/update/${item.id}`)
                    }
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
                    <td className="pl-4 py-5">{item.quantity}</td>
                    <td className="px-4 py-5 flex items-center gap-2">
                      {Array(item?.maxPerson)
                        .fill(0)
                        .map((_, index) => (
                          <IoPersonSharp key={index} size={20} />
                        ))}
                    </td>
                    <td className="px-4 py-5">
                      {item?.price?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}{" "}
                      / đêm
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-5 "
                    >
                      <Switch
                        checked={item.status === "active" ? true : false}
                        onChange={() =>
                          handleChangeStatus(item.id, item.status)
                        }
                      />
                    </td>
                    <td className="flex items-center gap-4 justify-end mr-4">
                      <FaEdit size={23} className="cursor-pointer" />
                      {/* <MdDelete size={23} className="cursor-pointer" /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerRoom;
