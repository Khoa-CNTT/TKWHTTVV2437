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

interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const Advertising = () => {
  const [valueSearch, setValueSearch] = useState<string>("");
  const [showDeleteText, setShowDeleteText] = useState<boolean>(false);
  const [dataAdOrder, setDataAdOrder] = useState<IAdOrderAdmin[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("0");
  const [type, setType] = useState<number>(0);
  const [text] = useDebounce(valueSearch, 500);

  useEffect(() => {
    if (valueSearch.length > 0) {
      setShowDeleteText(true);
    } else {
      setShowDeleteText(false);
    }
  }, [valueSearch]);

  useEffect(() => {
    const fetchDataAdOrder = async () => {
      const query: {
        page?: number;
        text?: string;
        status?: string;
        type?: number;
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

      if (type) {
        query.type = type;
      }

      const response = await apisAdOrder.getListAdOrderByAdmin(query);

      if (response?.data) {
        setDataAdOrder(response?.data);
        setPagination(response?.pagination);
      }
    };
    fetchDataAdOrder();
  }, [currentPage, text, status, type]);

  return (
    <div className="w-full">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Danh sách đã mua gói quảng cáo</h1>
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
            <div className="flex flex-col gap-1 w-[170px]">
              <label className="font-semibold text-md">Chọn gói</label>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                onChange={(e) => setType(Number(e.target.value))}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "10px", // Tùy chỉnh padding
                  },
                }}
              >
                <MenuItem value={0}>Chọn gói</MenuItem>
                <MenuItem value={1}>Gói thường</MenuItem>
                <MenuItem value={2}>Gói Vip</MenuItem>
              </Select>
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
                <MenuItem value={"pending"}>Chờ xác nhận</MenuItem>
                <MenuItem value={"done"}>Thành công</MenuItem>
                <MenuItem value={"failed"}>Thất bại</MenuItem>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mt-4 rounded-xl">
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
              <tr>
                <th className="px-4 py-3 text-left">STT</th>
                <th className="pl-4 py-3 text-left">Tên gói</th>
                <th className="px-4 py-3 text-left">Tên chủ sở hữu</th>
                <th className="px-4 py-3 text-left">Tên người mua</th>
                <th className="px-4 py-3 text-left">Giá</th>
                <th className="px-4 py-3 text-left">Phương thức</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody className=" text-[-14] font-semibold">
              {dataAdOrder.map((item, index) => (
                <tr
                  key={item?.id}
                  className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-4 py-5">{`${pagination?.pageSize * (pagination?.currentPage - 1) + index + 1}`}</td>
                  <td className="px-4 py-5">{item?.advertising?.name}</td>
                  <td className="pl-4 py-5">{item?.property?.name}</td>
                  <td className="pl-4 py-5">{`${item?.user?.firstName} ${item.user.lastName}`}</td>
                  <td className="pl-4 text-red-600">
                    {item?.advertising?.price.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="px-4 py-5 flex items-center gap-2">
                    {item?.methodPay?.toLocaleUpperCase()}
                  </td>
                  <td className="px-4 py-5">
                    {item?.status === "pending"
                      ? "Chờ xác nhận"
                      : item?.status === "done"
                        ? "Thành công"
                        : item?.status === "failed"
                          ? "Đã hủy"
                          : item?.status}
                  </td>
                </tr>
              ))}
            </tbody>
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
  );
};

export default Advertising;
