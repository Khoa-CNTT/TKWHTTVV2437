"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { IoIosSearch } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CitySearchContainer from "./CitySearchContainer";
import SearchTextContainer from "./SearchTextContainer";

import apisCategory from "@/apis/category";

const SearchContainer = () => {
  const router = useRouter();
  const [data, setData] = useState<{
    text: string;
    status: number;
    slug?: string;
  }>({
    text: "",
    status: 0,
    slug: "",
  });
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState([]);
  const [showChooseSearch, setShowChooseSearch] = useState<boolean>(false);

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
        setShowChooseSearch(false); // Đóng CitySearchContainer khi click bên ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmitSearch = () => {
    if (data.status === 1) {
      router.push(`detail/${data.slug}`);
    } else {
      const query: { city?: string; category?: string } = {};

      if (data?.text) {
        query.city = data.text;
      }

      if (categoryId) {
        query.category = categoryId;
      }

      const queryString = new URLSearchParams(
        query as Record<string, string>
      ).toString();

      router.push(`/search?${queryString}`);
    }
  };

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
            onClick={() => setShowChooseSearch(true)}
            value={data?.text}
            onChange={(e) => setData({ text: e.target.value, status: 0 })}
            className="outline-none w-full"
            placeholder="Nhập địa điểm muốn đi!"
          ></input>
        </div>

        {showChooseSearch && data?.text.length === 0 && (
          <div className="absolute top-[110%] left-0">
            <CitySearchContainer
              onShowChooseSearch={setShowChooseSearch}
              onSetData={setData}
            />
          </div>
        )}

        {showChooseSearch && data?.text.length > 0 && (
          <div className="absolute top-[110%] left-0 z-10">
            <SearchTextContainer
              onShowChooseSearch={setShowChooseSearch}
              onSetData={setData}
              text={data?.text}
            />
          </div>
        )}
      </div>
      <FormControl className="flex-3">
        {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categoryId || "0"} // Giá trị mặc định từ state
          onChange={(e) => setCategoryId(e.target.value)}
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
      <button
        onClick={handleSubmitSearch}
        className="flex items-center gap-2 border-blue-700 border text-blue-800 hover:bg-blue-200 font-semibold px-8 py-3 rounded-md"
      >
        <IoIosSearch className="text-blue-800" size={27} />
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchContainer;
