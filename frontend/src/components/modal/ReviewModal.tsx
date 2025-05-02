"use client";

import React, { useState, useEffect } from "react";
import { ratingText } from "@/helper/ratingText";
import { IoMdClose } from "react-icons/io";
import { PiWarningCircleLight } from "react-icons/pi";
import ReviewItem from "../Item/ReviewItem";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import apisReview from "@/apis/review";
import { IReview } from "@/app/types/review";

const dataSort = [
  {
    id: 1,
    key: "newest",
    value: "Mới nhất",
  },
  {
    id: 2,
    key: "oldest",
    value: "Cũ nhất",
  },
  {
    id: 3,
    key: "highest",
    value: "Đánh giá cao nhất",
  },
  {
    id: 4,
    key: "lowest",
    value: "Đánh giá thấp nhất",
  },
];

const sortMapping = {
  newest: {
    sortBy: "createdAt",
    order: "desc",
  },
  oldest: {
    sortBy: "createdAt",
    order: "asc",
  },
  highest: {
    sortBy: "rating",
    order: "desc",
  },
  lowest: {
    sortBy: "rating",
    order: "asc",
  },
} as const;

interface IProps {
  propertyId: string;
  onShowModalReview: (x: boolean) => void;
  avgRating: string;
  reviewCount: number;
}

type SortKey = keyof typeof sortMapping; // Lấy kiểu từ các key của sortMapping

const ReviewModal: React.FC<IProps> = ({
  propertyId,
  onShowModalReview,
  avgRating,
  reviewCount,
}) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("highest");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = {
          page: page, // Trang hiện tại
          ...sortMapping[sort],
        };
        const response = await apisReview.getListReviewByPropertyId(
          propertyId,
          query
        );
        if (response?.data) {
          setReviews((prev) => {
            // On initial load or when sort changes (page is reset to 1)
            if (page === 1 || isInitialLoad) {
              setIsInitialLoad(false);
              return response.data;
            }
            // For pagination, append new reviews
            return [...prev, ...response.data];
          });
          setTotalItem(response.pagination.totalItems);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [propertyId, page, sort, isInitialLoad]);

  useEffect(() => {
    // Reset page and clear reviews when sort changes
    setPage(1);
    setReviews([]);
    setIsInitialLoad(true);
  }, [sort]);

  return (
    <div className="fixed w-creeen h-screen z-10 inset-0 flex items-center justify-center bg-overblack ">
      <div className="bg-white w-[800px] h-[80vh] rounded-md shadow-lg py-4 pl-6 flex flex-col">
        <div className="flex items-center gap-4">
          <IoMdClose
            onClick={() => onShowModalReview(false)}
            className="text-blue-800 hover:bg-blue-200 rounded-full cursor-pointer"
            size={27}
          />

          <p className="font-semibold">Đánh giá của khách hàng</p>
        </div>

        <div className="mt-6">
          <p className="text-xl font-semibold text-green-800">{`${avgRating}/5 ${ratingText(5)}`}</p>

          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <p>{`${reviewCount} đánh giá`}</p>
            <PiWarningCircleLight className="text-gray-700" size={18} />
          </div>
        </div>

        <div className="mt-6">
          <FormControl sx={{ width: 250 }}>
            <InputLabel id="demo-multiple-name-label">Sắp xếp theo</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              value={sort}
              input={<OutlinedInput label="Sắp xếp theo" />}
              onChange={(e) => setSort(e.target.value as SortKey)}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              {dataSort.map((item) => (
                <MenuItem key={item.key} value={item.key}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mt-6 overflow-y-auto flex-1 overflow-hidden">
          {reviews.map((item) => (
            <ReviewItem
              key={item.id}
              user={item.user}
              createdAt={item.createdAt}
              text={item.text}
              rating={item.rating}
            />
          ))}

          {reviews.length < totalItem && (
            <div className="flex justify-center mt-4 mb-4">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="border-[1px] border-gray-400 rounded-3xl py-2 px-5 text-blue-600 font-semibold hover:bg-blue-200 cursor-pointer"
              >
                See more reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
