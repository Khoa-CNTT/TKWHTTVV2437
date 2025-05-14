"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import apisProperty from "@/apis/property";
import { useDebounce } from "use-debounce";
import MessageNotFound from "../Item/MessageNotFound";
import { IProperty, IPropertyAdmin } from "@/app/types/property";
import { toast } from "react-toastify";
import { Stack, Pagination } from "@mui/material";

interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface IProps {
  provinces: { name: string; code: string }[];
}

const ManagePropertyContent: React.FC<IProps> = ({ provinces }) => {
  const [valueSearch, setValueSearch] = useState<string>("");
  const [showDeleteText, setShowDeleteText] = useState<boolean>(false);
  const [propertyList, setPropertyList] = useState<IPropertyAdmin[]>([]);
  const [text] = useDebounce(valueSearch, 500);
  const [check, setCheck] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("0");
  const [city, setCity] = useState<string>("0");

  useEffect(() => {
    const fetchPropertyList = async () => {
      const query: {
        page?: number;
        text?: string;
        status?: string;
        city?: string;
      } = {
        // search: valueSearch,
      };

      if (currentPage) {
        query.page = currentPage;
      }

      if (text) {
        query.text = text;
      }

      if (status !== "0") {
        query.status = status;
      }

      if (city !== "0") {
        query.city = city;
      }

      const response = await apisProperty.getListPropertyByAdmin(query);

      if (response?.data) {
        setPropertyList(response?.data);
        setPagination(response?.pagination);
      }
    };
    fetchPropertyList();
  }, [text, currentPage, check, status, city]);

  useEffect(() => {
    setCurrentPage(1);
  }, [city, text, status, check]);

  useEffect(() => {
    if (valueSearch.length > 0) {
      setShowDeleteText(true);
    } else {
      setShowDeleteText(false);
    }
  }, [valueSearch]);

  const handleChangeStatus = async (id: string, status: string) => {
    if (status === "active") {
      try {
        const response = await apisProperty.updateStatusProperty(
          id,
          "inactive"
        );
        if (response.status === "OK") {
          toast.success("Cập nhật trạng thái thành công!");
          setCheck((prev) => !prev);
        } else {
          toast.error("Cập nhật trạng thái thất bại!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Cập nhật trạng thái thất bại!");
      }
    } else {
      try {
        const response = await apisProperty.updateStatusProperty(id, "active");
        if (response.status === "OK") {
          toast.success("Cập nhật trạng thái thành công!");
          setCheck((prev) => !prev);
        } else {
          toast.error("Cập nhật trạng thái thất bại!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Cập nhật trạng thái thất bại!");
      }
    }
  };

  return (
    <div className="relative w-full">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Danh sách các chủ sở hữu</h1>
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
            <div className="flex flex-col gap-1 flex-2 w-[170px]">
              <label className="font-semibold text-md">Tỉnh / Thành phố</label>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={city || "0"} // Giá trị mặc định từ state
                  onChange={(e) => setCity(e.target.value)}
                  sx={{
                    "& .MuiSelect-select": {
                      padding: "10px", // Tùy chỉnh padding
                    },
                  }}
                >
                  <MenuItem value={"0"}>Chọn tỉnh / thành phố</MenuItem>
                  {provinces?.map((item: { name: string; code: string }) => (
                    <MenuItem key={item.code} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                <MenuItem value={"active"}>Hoạt động</MenuItem>
                <MenuItem value={"inactive"}>Không hoạt động</MenuItem>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mt-4 rounded-xl">
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
              <tr>
                <th className="px-4 py-3 text-left">STT</th>
                <th className="px-4 py-3 text-left">Ảnh</th>
                <th className="pl-4 py-3 text-left">Tên </th>
                <th className="px-4 py-3 text-left">Tên chủ sở hữu</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-left">Tỉnh/Thành phố</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                {/* <th className="px-4 py-3 text-left">Giảm hiển thị</th> */}
                <th className="px-4 py-3 text-left">Chập nhận/Từ chối</th>
              </tr>
            </thead>

            {propertyList?.length === 0 ? (
              <MessageNotFound />
            ) : (
              <tbody className="text-[14px] font-semibold">
                {propertyList.map((item, index) => (
                  <tr
                    key={item?.id}
                    className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  >
                    <td className="px-4 py-5">{`${pagination?.pageSize * (pagination?.currentPage - 1) + index + 1}`}</td>
                    <td className="px-4 py-5">
                      <img
                        src={item?.images[0]?.image}
                        alt=""
                        className="w-[50px] h-[50px] rounded-md object-cover"
                      />
                    </td>
                    <td className="pl-4 py-5">
                      {item?.name?.length > 30
                        ? `${item?.name.slice(0, 30)}...`
                        : item?.name}
                    </td>
                    <td className="pl-4 py-5">{`${item?.users?.firstName} ${item?.users?.lastName}`}</td>
                    <td className="px-4 py-5">{`${item?.category?.name}`}</td>
                    <td className="px-4 py-5">{`${item?.propertyAddress?.city}`}</td>
                    <td className="px-4 py-5 text-red-600">
                      <Switch
                        checked={item.status === "active" ? true : false}
                        onChange={() =>
                          handleChangeStatus(item.id, item.status)
                        }
                      />
                    </td>
                    {/* <td className="px-4 py-5 flex items-center gap-2">
                      <Switch
                      // checked={item.status === "active" ? true : false}
                      // onChange={() =>
                      //   handleChangeVisible(item.id, item.status)
                      // }
                      />
                    </td> */}
                    <td className="px-4 py-5">
                      {`${item?.approved}/${item?.reject}`}
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
  );
};

export default ManagePropertyContent;
