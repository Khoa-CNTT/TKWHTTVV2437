"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaParking } from "react-icons/fa";

import { IoIosHeartEmpty } from "react-icons/io";
import { SlPicture } from "react-icons/sl";
import { FaBusAlt } from "react-icons/fa";

const HighlightProperty = () => {
  return (
    <div className="border-[1px] border-gray-300 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Các điểm nổi bật tại chỗ nghỉ</h3>

      <div className="flex items-center gap-3 mt-4">
        <FaParking size={30} />
        <div>
          <span className="text-md font-semibold">Bãi đỗ xe miễn phí</span>
          <p className="text-gray-500 text-sm">
            Bãi đỗ xe miễn phí. Bãi đổ xe riêng. Bãi đổ xe trong khuôn viên
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <SlPicture size={30} />
        <div>
          <span className="text-md font-semibold">Tầm nhìn</span>
          <p className="text-gray-500 text-sm">
            Ban công, Nhìn ra thành phố, Tầm nhìn ra khung cảnh
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <FaBusAlt size={30} />
        <div>
          <span className="text-md font-semibold">Dịch vụ đưa đón</span>
          <p className="text-gray-500 text-sm">Xe đưa đón sân bay</p>
        </div>
      </div>

      <button className="w-full border-[1px] border-blue-700 text-center rounded-md py-3 text-blue-700 font-semibold flex items-center justify-center gap-3 mt-4 cursor-pointer hover:bg-blue-100 transition-all duration-200">
        <IoIosHeartEmpty size={20} className="text-blue-700" />
        <span className="text-sm">Thêm vào danh sách yêu thích</span>
      </button>
    </div>
  );
};

export default HighlightProperty;
