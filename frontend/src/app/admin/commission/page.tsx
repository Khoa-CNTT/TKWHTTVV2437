"use client";

import { useState, useRef, useEffect } from "react";
import { OutlinedInput } from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import apisAdOrder from "@/apis/adOrder";
import { IAdOrderAdmin } from "@/app/types/adOrder";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useDebounce } from "use-debounce";
import { ICommissionPaymentAdmin } from "@/app/types/commissionPayment";
import apisCommissionPayment from "@/apis/commissionPayment";
import moment from "moment";
import clsx from "clsx";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DateCalendar,
  dateCalendarClasses,
} from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import MessageNotFound from "@/components/Item/MessageNotFound";

interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const Commission = () => {
  const [valueSearch, setValueSearch] = useState<string>("");
  const [showDeleteText, setShowDeleteText] = useState<boolean>(false);
  const [dataCommissionPayment, setDataCommissionPayment] = useState<
    ICommissionPaymentAdmin[]
  >([]);
  const [pagination, setPagination] = useState<IPagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("0");
  // const [type, setType] = useState<number>(0);
  const [text] = useDebounce(valueSearch, 500);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const datePicker = document.querySelector(".date-picker-container");
      if (datePicker && !datePicker.contains(event.target as Node)) {
        setShowDate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (valueSearch.length > 0) {
      setShowDeleteText(true);
    } else {
      setShowDeleteText(false);
    }
  }, [valueSearch]);

  useEffect(() => {
    const fetchDataCommissionPayment = async () => {
      const query: {
        page?: number;
        text?: string;
        status?: string;
        type?: number;
        month?: number;
        year?: number;
      } = {};

      if (currentPage) {
        query.page = currentPage;
      }

      if (text) {
        query.text = text;
      }

      if (status !== "0") {
        query.status = status;
      }

      if (date) {
        query.month = date.month() + 1;
        query.year = date.year();
      }

      const response =
        await apisCommissionPayment.getListCommissionPaymentByAdmin(query);

      if (response?.data) {
        setDataCommissionPayment(response?.data);
        setPagination(response?.pagination);
      }
    };
    fetchDataCommissionPayment();
  }, [currentPage, text, status, date]);

  useEffect(() => {
    setCurrentPage(1);
  }, [text, status, date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="relative w-full">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Danh sách đã mua gói quảng cáo
            </h1>
          </div>

          <div className="flex justify-between items-end mt-8">
            <div className="w-[27%] relative">
              <OutlinedInput
                placeholder="Please enter text"
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
                sx={{
                  width: "100%", // Tùy chỉnh chiều rộng
                  borderRadius: "10px", // Bo góc
                }}
                inputProps={{
                  style: {
                    padding: "12px 30px 12px 35px", // Padding trên/dưới và trái/phải
                  },
                }}
              />

              <IoSearch
                size={22}
                className="absolute top-[50%] left-[7px] translate-y-[-50%] text-gray-600"
              />

              {showDeleteText && (
                <IoMdClose
                  onClick={() => setValueSearch((prev) => "")}
                  size={22}
                  className="absolute top-[50%] translate-y-[-50%] text-gray-600 right-[10px] cursor-pointer z-10"
                />
              )}
            </div>

            <div className="flex items-center gap-4">
              <div
                onClick={() => setShowDate(true)}
                className="relative flex flex-col gap-1 w-[170px] date-picker-container"
              >
                <label className="font-semibold text-md">Chọn tháng</label>

                <DateField
                  defaultValue={date}
                  value={date}
                  format="MM-YYYY"
                  sx={{
                    "& .MuiInputBase-root": {
                      // Targets the input root element
                      padding: "1px", // Adjust this value as needed
                    },
                    // Or if you want to target specific parts:
                    "& .MuiOutlinedInput-input": {
                      // Targets just the input field
                      padding: "10px 14px",
                    },
                  }}
                />
                {showDate && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[100%] left-0 bg-white shadow-md"
                  >
                    <DateCalendar
                      defaultValue={date}
                      views={["month", "year"]}
                      openTo="month"
                      onYearChange={(date) => {
                        if (date) {
                          setDate(date);
                          setShowDate(false);
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 w-[170px]">
                <label className="font-semibold text-md">Trạng thái</label>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{
                    "& .MuiSelect-select": {
                      padding: "10px", // Tùy chỉnh padding
                    },
                  }}
                >
                  <MenuItem value={"0"}>Chọn trạng thái</MenuItem>
                  <MenuItem value={"done"}>Đã thanh toán</MenuItem>
                  <MenuItem value={"pending"}>Chưa thanh toán</MenuItem>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-hidden mt-4 rounded-xl">
            <table className="min-w-full text-black">
              <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
                <tr>
                  <th className="px-4 py-3 text-left">STT</th>
                  <th className="pl-4 py-3 text-left">Tên chủ sở hữu</th>
                  <th className="px-4 py-3 text-left">Tháng</th>
                  <th className="px-4 py-3 text-left">Doanh thu</th>
                  <th className="px-4 py-3 text-left">Hoa hồng</th>
                  <th className="px-4 py-3 text-left">Tiền</th>
                  <th className="px-4 py-3 text-left">Phương thức</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-left">Người thanh toán</th>
                  <th className="px-4 py-3 text-left">Thời gian</th>
                </tr>
              </thead>

              {dataCommissionPayment?.length === 0 ? (
                <MessageNotFound />
              ) : (
                <tbody className="text-[14px] font-semibold">
                  {dataCommissionPayment.map((item, index) => (
                    <tr
                      key={item?.id}
                      className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-4 py-5">{`${pagination?.pageSize * (pagination?.currentPage - 1) + index + 1}`}</td>
                      <td className="px-4 py-5">
                        {item?.property?.name.length > 20
                          ? `${item?.property?.name.slice(0, 20)}...`
                          : item?.property?.name}
                      </td>
                      <td className="pl-4 py-5">{`${item?.month}/${item?.year}`}</td>
                      <td className="px-4 py-5">
                        {item?.totalRevenue?.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-5">{`${item?.commissionRate}%`}</td>
                      <td className="px-4 py-5 text-red-600">
                        {item?.commissionAmount?.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-5 flex items-center gap-2">
                        {item?.methodPay
                          ? item?.methodPay?.toLocaleUpperCase()
                          : "Trống"}
                      </td>
                      <td
                        className={clsx("px-4 py-5", {
                          "text-green-500": item.status === "done",
                          "text-yellow-500": item.status === "pending",
                        })}
                      >
                        {item?.status === "pending"
                          ? "Chưa thanh toán"
                          : item?.status === "done"
                            ? "Đã thanh toán"
                            : "Đã hủy"}
                      </td>
                      <td className="pl-4 py-5">{`${item?.user?.firstName} ${item?.user?.lastName}`}</td>
                      <td className="px-4 py-5">
                        {item?.paymentDate
                          ? moment(item?.paymentDate).format("DD/MM/YYYY")
                          : "Trống"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>

        {pagination?.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Stack spacing={2}>
              <Pagination
                page={currentPage}
                onChange={(event: React.ChangeEvent<unknown>, page: number) =>
                  setCurrentPage(page)
                }
                count={pagination?.totalPages}
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default Commission;
