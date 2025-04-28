"use client";

import React from "react";
import { GiVillage } from "react-icons/gi";
import { HiHomeModern } from "react-icons/hi2";
import { GiVikingLonghouse } from "react-icons/gi";
import { TbFilterCheck } from "react-icons/tb";

const menuCategory = [
  {
    id: 1,
    icon: <GiVillage size={40} />,
    title: "Tất cả",
  },
  {
    id: 2,
    icon: <HiHomeModern size={40} />,
    title: "Homestay",
  },
  {
    id: 3,
    icon: <GiVikingLonghouse size={40} />,
    title: "Resort",
  },
];

const MenuSearchContainer = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        {menuCategory.map((item) => (
          <div className="flex flex-col items-center">
            {item.icon}
            <p className="text-sm mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 border-2 border-blue-800 text-blue px-4 py-2 rounded-md hover:bg-blue-200">
        <TbFilterCheck className="text-blue-800" size={20} />
        <span className="text-blue-800 font-semibold">Bộ lọc</span>
      </button>
    </div>
  );
};

export default MenuSearchContainer;
