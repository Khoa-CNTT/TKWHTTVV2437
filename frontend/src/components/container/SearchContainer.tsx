"use client";

import { useEffect, useState, useRef } from "react";
import { IoLocationOutline } from "react-icons/io5";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CitySearchContainer from "./CitySearchContainer";

import apisCategory from "@/apis/category";

const SearchContainer = () => {
  const [data, setData] = useState<{ search: string; categoryId: string }>({
    search: "",
    categoryId: "0",
  });
  const [categories, setCategories] = useState([]);
  const [showChooseCity, setShowChooseCity] = useState<boolean>(false);

  const containerRef = useRef<HTMLInputElement>(null); // Tham chiếu đến thành phần chứa input

  useEffect(() => {
    const fetchDataCategories = async () => {
      const response = await apisCategory.getAllList();
      if (response?.data) {
        setCategories(response.data);
      }
    };

    fetchDataCategories();
  }, []);

  // hidden show choose city
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowChooseCity(false); // Đóng CitySearchContainer khi click bên ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white py-4 px-6 rounded-xl flex items-center gap-4 w-[850px]">
      <div
        ref={containerRef}
        className="relative border-[2px] rounded-xl border-gray-300 px-4 py-2 flex items-center gap-2 flex-5"
      >
        <IoLocationOutline size={27} />
        <div className="w-full">
          <p className="font-semibold text-sm">Điểm đến</p>
          <input
            onClick={() => setShowChooseCity(true)}
            value={data?.search}
            className="outline-none w-full"
            placeholder="Nhập địa điểm muốn đi!"
          ></input>
        </div>

        {showChooseCity && data?.search.length === 0 && (
          <div className="absolute top-[110%] left-0">
            <CitySearchContainer />
          </div>
        )}
      </div>
      <FormControl className="flex-3">
        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.categoryId || "0"} // Giá trị mặc định từ state
          onChange={(e) => setData({ ...data, categoryId: e.target.value })}
          sx={{
            "& .MuiSelect-select": {
              padding: "20px", // Tùy chỉnh padding
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px", // Tăng độ dày viền
              borderRadius: "12px",
            },
          }}
        >
          <MenuItem value={"0"}>Chọn loại nhà / phòng</MenuItem>
          {categories.map((item: { id: string; name: string }) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-3xl">
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchContainer;
