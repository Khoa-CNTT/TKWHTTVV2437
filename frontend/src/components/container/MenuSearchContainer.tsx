"use client";

import React, { useEffect, useState } from "react";
import { GiVillage } from "react-icons/gi";
import { HiHomeModern } from "react-icons/hi2";
import { GiVikingLonghouse } from "react-icons/gi";
import { TbFilterCheck } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FaHotel } from "react-icons/fa";
import { SiHomeassistantcommunitystore } from "react-icons/si";

import slugify from "slugify";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import { IAmenity } from "@/app/types/amenity";
import apisAmenity from "@/apis/amenity";
import clsx from "clsx";

const menuCategory = [
  {
    id: 1,
    icon: <GiVillage size={40} />,
    title: "Tất cả",
    categoryId: 0,
  },
  {
    id: 2,
    icon: <HiHomeModern size={40} />,
    title: "Homestay",
    categoryId: 1,
  },
  {
    id: 3,
    icon: <GiVikingLonghouse size={40} />,
    title: "Resort",
    categoryId: 2,
  },
  {
    id: 4,
    icon: <FaHotel size={36} />,
    title: "Khách sạn",
    categoryId: 3,
  },
  {
    id: 5,
    icon: <SiHomeassistantcommunitystore size={37} />,
    title: "Village",
    categoryId: 4,
  },
];

interface IProps {
  provinces: { name: string; code: string }[];
}

const MenuSearchContainer: React.FC<IProps> = ({ provinces }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const [value, setValue] = React.useState<number[]>([0, 100]);
  const [amenities, setAmenities] = useState<IAmenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const searchParams = useSearchParams(); // Lấy query từ URL

  useEffect(() => {
    const fetchDataAmenities = async () => {
      const response = await apisAmenity.getAllList();

      if (response?.data) {
        setAmenities(response.data);
      }
    };

    fetchDataAmenities();
  }, []);

  // function handle
  const handleCheckboxChange = (id: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(id)) {
        // Nếu đã chọn, loại bỏ khỏi danh sách
        return prev.filter((amenityId) => amenityId !== id);
      } else {
        // Nếu chưa chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const handleChange = (event: Event, newValue: number[]) => {
    setValue(newValue);
  };

  // handle clear filter
  const handleClearFilter = () => {
    setValue([0, 100]);
    setSelectedAmenities([]);
  };

  // handle submit search
  const handleSubmit = () => {
    // Chuẩn bị dữ liệu query
    const query = new URLSearchParams({
      minPrice: (value[0] * 200000).toString(), // Giá tối thiểu
      maxPrice: (value[1] * 200000).toString(), // Giá tối đa
      amenities: selectedAmenities.join(","), // Tiện nghi (danh sách ID, phân cách bằng dấu phẩy)
    });

    query.set("page", "1");

    // Cập nhật URL với query string
    router.push(`/search?${query.toString()}`);

    // Đóng modal sau khi gửi
    setIsModalOpen(false);
  };

  // Lấy dữ liệu từ URL và set vào state
  useEffect(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const amenitiesFromUrl = searchParams.get("amenities");

    if (minPrice && maxPrice) {
      setValue([parseInt(minPrice) / 200000, parseInt(maxPrice) / 200000]); // Chuyển đổi giá trị từ URL về slider
    }

    if (amenitiesFromUrl) {
      setSelectedAmenities(amenitiesFromUrl.split(",")); // Chuyển đổi danh sách tiện nghi từ chuỗi thành mảng
    }
  }, [searchParams]);

  // handle click category
  const handleClickCategory = (category: number) => {
    const query = new URLSearchParams(searchParams.toString());
    if (category) {
      // Cập nhật URL với giá trị category
      query.set("category", category.toString()); // Thêm hoặc cập nhật giá trị category
      query.set("page", "1");
    } else {
      query.delete("category");
    }
    router.push(`/search?${query.toString()}`); // Điều hướng với query string mới
  };

  // handle choose city
  const handleChooseCity = (city: string) => {
    const query = new URLSearchParams(searchParams.toString());
    if (city !== "0") {
      // Cập nhật URL với giá trị category
      query.set("city", city.toString()); // Thêm hoặc cập nhật giá trị category
      query.set("page", "1");
    } else {
      // Xóa giá trị city khỏi URL
      query.delete("city");
    }
    router.push(`/search?${query.toString()}`); // Điều hướng với query string mới
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        {menuCategory.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClickCategory(item.categoryId)}
            className={clsx("flex flex-col items-center cursor-pointer pb-2", {
              "border-b-2 border-black":
                (searchParams.get("category") || "0") ===
                item.categoryId.toString(),
            })}
          >
            {item.icon}
            <p className="text-sm mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 flex-2 w-[170px]">
          {/* <label className="font-semibold text-md">Tỉnh / Thành phố</label> */}
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchParams.get("city") || "0"} // Giá trị mặc định từ state
              onChange={(e) => handleChooseCity(e.target.value)}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"0"}>Chọn tỉnh / thành phố</MenuItem>
              {provinces?.map((item: { name: string; code: string }) => (
                <MenuItem key={item.code} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border-2 border-blue-800 text-blue px-4 py-2 rounded-md hover:bg-blue-200"
        >
          <TbFilterCheck className="text-blue-800" size={20} />
          <span className="text-blue-800 font-semibold">Bộ lọc</span>
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-[550px] h-full shadow-lg transform translate-x-0 transition-transform duration-300"
          >
            <div className="relative px-4 py-6 border-b">
              <IoMdClose
                onClick={() => setIsModalOpen(false)}
                size={30}
                className="rounded-full text-blue-500 cursor-pointer hover:bg-gray-200 absolute"
              />
              <p className="text-center font-semibold text-xl w-full">Bộ lọc</p>
            </div>
            <div className="p-6">
              <div>
                <h2 className="text-2xl font-semibold pb-3">Khoảng giá</h2>
                <Box>
                  <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <div className="flex items-center gap-4 mt-2">
                  <TextField
                    id="outlined-basic"
                    label="Giá tối thiểu"
                    variant="outlined"
                    value={(value[0] * 200000)?.toLocaleString("vi-VN")}
                    sx={{ width: "100%" }}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Giá tối đa"
                    variant="outlined"
                    value={(value[1] * 200000)?.toLocaleString("vi-VN")}
                    sx={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-semibold pb-3">Tiện nghi</h2>

                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((item: IAmenity) => (
                    <FormControlLabel
                      key={item.id}
                      control={
                        <Checkbox
                          checked={selectedAmenities.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        ></Checkbox>
                      }
                      label={
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span>{item.name}</span>
                        </div>
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 border-top w-full bg-white border-gray-300 p-4 flex items-center justify-between">
              <button
                onClick={handleClearFilter}
                className="text-blue-950 text-sm font-semibold cursor-pointer"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-950 text-white px-4 rounded-md shadow-md py-2"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSearchContainer;
