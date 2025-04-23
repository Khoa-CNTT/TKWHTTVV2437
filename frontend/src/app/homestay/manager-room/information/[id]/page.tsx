"use client";
import React, { ChangeEvent, useState } from "react";
import { IImage } from "@/app/types/property";
import { v4 as uuidv4 } from "uuid";

import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import apisImage from "@/apis/image";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";

// import icon
import { FaSwimmer } from "react-icons/fa";
import { TbSmokingNo } from "react-icons/tb";
import { FaWifi } from "react-icons/fa";
import { LuCircleParking } from "react-icons/lu";
import { FaUmbrellaBeach } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import { TbBus } from "react-icons/tb";
import { MdFamilyRestroom } from "react-icons/md";
import { IAmenity } from "@/app/types/amenity";
import FormControlLabel from "@mui/material/FormControlLabel";

// set icon map
const iconMap: { [key: string]: JSX.Element } = {
  FaSwimmer: <FaSwimmer />,
  TbSmokingNo: <TbSmokingNo />,
  FaWifi: <FaWifi />,
  LuCircleParking: <LuCircleParking />,
  FaUmbrellaBeach: <FaUmbrellaBeach />,
  MdRestaurant: <MdRestaurant />,
  TbBus: <TbBus />,
  MdFamilyRestroom: <MdFamilyRestroom />,
};

const InformationRoom = () => {
  const [selectedImage, setSelectedImage] = useState<IImage[]>([]);
  const [showTrash, setShowTrash] = useState<string>("");
  const [data, setData] = useState<{ name: string }>({
    name: "",
  });
  const [amenities, setAmenities] = useState<IAmenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleRemoveImage = (id: string) => {
    setSelectedImage((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        formData.append("images", file);
      });

      const uploadImage = async () => {
        const response = await apisImage.uploadImageMutiple(formData);

        if (response.files) {
          const newImages = response.files.map((item: { url: string }) => ({
            id: uuidv4(),
            image: item.url,
          }));
          setSelectedImage((prev) => [...prev, ...newImages]);
        }
      };

      uploadImage();
    }
  };

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Thông tin phòng</h1>

      <h3 className="mt-8 text-md font-semibold">Thông tin ảnh</h3>

      <div className="grid grid-cols-6 gap-2 mt-2">
        {selectedImage?.map((item: { image: string; id: string }) => (
          <div
            className="relative"
            onMouseEnter={() => setShowTrash(item.id)}
            onMouseLeave={() => setShowTrash("")}
          >
            <img
              key={item.id}
              alt="image"
              className="h-[160px] w-full rounded-md object-cover"
              src={item.image}
            ></img>

            {showTrash === item.id && (
              <button
                onClick={() => handleRemoveImage(item.id)}
                className="absolute top-[10px] right-[10px]"
              >
                <MdDeleteForever className="text-red-500" size={24} />
              </button>
            )}
          </div>
        ))}

        <label
          htmlFor="file-input"
          className="border-[2px] border-blue-700 flex items-center justify-center border-dashed cursor-pointer h-[160px]"
        >
          <div>
            <div className="flex justify-center pb-3">
              <FaPlus size={25} className="text-blue-700" />
            </div>
            <span className="font-semibold">Chọn thêm ảnh</span>
          </div>
        </label>
        <input
          id="file-input"
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </div>

      <h4 className="mt-8 text-2xl font-semibold">Thông tin chi tiết phòng</h4>

      <div className="mt-4">
        <div className="flex flex-col gap-2 w-[70%]">
          <label className="font-semibold text-md">Tên homestay</label>
          <TextField
            value={data?.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            sx={{
              "& .MuiInputBase-input": {
                padding: "10px", // Padding cho nội dung input
              },
            }}
            id="outlined-basic"
            variant="outlined"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <label className="font-semibold text-md">Thông tin các tiện ích</label>

        <div className="grid grid-cols-6 gap-4">
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
                <div className="text-green-700 flex items-center gap-2 text-sm font-medium">
                  <div className="text-xl">{iconMap[item.icon]}</div>
                  <span>{item.name}</span>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformationRoom;
