"use client";
import { RxUpdate } from "react-icons/rx";
import { AiOutlineCalendar } from "react-icons/ai";
import {
  DateRangeCalendar,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import React, { useState, useRef, useEffect } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePickerDay } from "@mui/x-date-pickers-pro/DateRangePickerDay";
import { useCheckoutContext } from "@/app/contexts/CheckoutContext";
import { LicenseInfo } from "@mui/x-license";

LicenseInfo.setLicenseKey(
  "8734ab1314fbd6cb24a1327c5640e63aTz0xNzIxNjc3NTAxNzU1LEU9MTc1MzIzNDQyNzc1NSxTPXByZW1pdW0sTE09YW5udWFsLEtWPTI="
);

const ChooseDateContainer = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showDateRange, setShowDateRange] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Dayjs | null, Dayjs | null]
  >([dayjs(new Date()), dayjs(new Date().setDate(new Date().getDate() + 2))]);

  const { setStartDate, setEndDate, startDate, endDate } = useCheckoutContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowDateRange(false); // Ẩn lịch khi click ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowDateRange = () => {
    setShowDateRange(!showDateRange);
  };

  const handleSubmit = () => {
    setStartDate(selectedDateRange[0] || null);
    setEndDate(selectedDateRange[1] || null);
    setShowDateRange(false); // Ẩn lịch sau khi chọn
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      <div
        onClick={handleShowDateRange}
        className="flex items-center gap-2 rounded-md border-[1px] border-gray-500 p-1 px-3 w-[30%] cursor-pointer"
      >
        <AiOutlineCalendar size={25} />
        <div>
          <p className="text-[11px]">Start date</p>
          <p className="text-[16px]">
            {selectedDateRange[0]?.format("DD/MM/YYYY") || "Chọn ngày"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-md border-[1px] border-gray-500 p-1 px-3 w-[30%] cursor-pointer relative">
        <AiOutlineCalendar size={25} />
        <div>
          <p className="text-[11px]">End date</p>
          <p className="text-[16px]">
            {selectedDateRange[1]?.format("DD/MM/YYYY") || "Chọn ngày"}
          </p>
        </div>

        {showDateRange && (
          <div
            ref={calendarRef}
            className="absolute top-[110%] left-[-100%] bg-white rounded-md shadow-md z-10"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangeCalendar
                defaultValue={selectedDateRange}
                onChange={(newValue) => setSelectedDateRange(newValue)}
                slots={{ day: DateRangePickerDay }}
              />
            </LocalizationProvider>

            <div className="flex justify-end gap-2 items-center px-4 py-2 border-t-[1px] border-gray-300">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-8 font-semibold py-2 rounded-3xl mt-2"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* <button
        onClick={handleSearchRoom}
        className="text-white font-medium bg-blue-700 px-8 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-all duration-200"
      >
        <RxUpdate className="text-white" size={20} />
        Thay đổi tìm kiếm
      </button> */}
    </div>
  );
};

export default ChooseDateContainer;
