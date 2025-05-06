"use client";

import apisProperty from "@/apis/property";
import { normalizeText } from "@/helper/norlizeText";
import { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

interface IProps {
  text: string;
  onSetData: (data: { text: string; status: number; slug?: string }) => void;
  onShowChooseSearch: (x: boolean) => void;
}

interface ITextSearch {
  name: string;
  propertyAddress: {
    city: string;
    country: string;
  };
  status: number;
  slug?: string;
}

const SearchTextContainer: React.FC<IProps> = ({
  text,
  onSetData,
  onShowChooseSearch,
}) => {
  const [textSearchs, setTextSearchs] = useState<ITextSearch[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apisProperty.getTextSearchProperty({
        text: text,
      });

      if (response?.data) {
        const seenCities = new Set<string>(); // Tập hợp để lưu các city đã xuất hiện

        const data = response?.data
          ?.map((item: ITextSearch) => {
            const normalizedName = normalizeText(item.name);
            const normalizedText = normalizeText(text);

            if (normalizedName.includes(normalizedText)) {
              return { ...item, status: 1 };
            } else {
              return { ...item, status: 2 };
            }
          })
          .filter((item: ITextSearch) => {
            // Loại bỏ các mục trùng lặp khi status === 2 và city giống nhau
            if (item.status === 2) {
              if (seenCities.has(item.propertyAddress.city)) {
                return false; // Loại bỏ mục trùng lặp
              }
              seenCities.add(item.propertyAddress.city); // Thêm city vào tập hợp
            }
            return true; // Giữ lại mục
          });

        setTextSearchs(data);
      }
    };

    fetchData();
  }, [text]);

  console.log({ textSearchs });

  return (
    <div className="bg-white p-4 rounded-md shadow-lg w-[408px] min-h-[200px]">
      <h4 className="font-semibold text-sm">Tìm kiếm theo từ khóa</h4>

      {textSearchs.map((item: ITextSearch, index: number) =>
        item.status === 1 ? (
          <div
            key={index}
            onClick={() => {
              onSetData({
                text: item.name,
                status: item.status,
                slug: item.slug,
              });
              onShowChooseSearch(false);
            }}
            className="w-full mt-2 cursor-pointer p-2 flex items-center border-b hover:bg-gray-200 border-gray-300 gap-3"
          >
            <FaHome size={25} />
            <div>
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-sm">{`${item.propertyAddress?.city}, ${item?.propertyAddress?.country}`}</p>
            </div>
          </div>
        ) : (
          <div
            key={index}
            onClick={() => {
              onSetData({
                text: item.propertyAddress.city,
                status: item.status,
              });
              onShowChooseSearch(false);
            }}
            className="w-full cursor-pointer p-2 flex items-center border-b hover:bg-gray-200 border-gray-300 gap-3"
          >
            <IoLocationOutline size={25} />
            <div>
              <p className="text-sm font-semibold">
                {item.propertyAddress.city}
              </p>
              <p className="text-sm">{item.propertyAddress.country}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SearchTextContainer;
