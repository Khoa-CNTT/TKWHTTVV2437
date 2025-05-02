"use client";

import { useState, useEffect } from "react";
import apisCity from "@/apis/city";
import { ICity } from "@/app/types/city";

interface IProps {
  onSetData: (data: { text: string; status: number; slug?: string }) => void;
  onShowChooseSearch: (x: boolean) => void;
}

const CitySearchContainer: React.FC<IProps> = ({
  onSetData,
  onShowChooseSearch,
}) => {
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    const fetchDataCities = async () => {
      const response = await apisCity.getListTop10City();

      if (response?.data) {
        setCities(response?.data);
      }
    };

    fetchDataCities();
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white p-4 rounded-md shadow-lg w-[408px] min-h-[200px]"
    >
      <h4 className="font-semibold text-sm">Tìm kiếm theo khu vực</h4>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {cities.map((item) => (
          <div
            onClick={() => {
              onSetData({ text: item.name, status: 2 });
              onShowChooseSearch(false);
            }}
            key={item.id}
            className="cursor-pointer"
          >
            <img
              className="rounded-md h-[96px] object-cover"
              src={item.image}
            ></img>
            <p className="text-sm font-semibold mt-1">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitySearchContainer;
