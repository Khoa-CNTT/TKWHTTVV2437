"use client";

import apiRegisterPartner from "@/api/registerPartner";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCaretDown, FaFilter, FaTrashAlt } from "react-icons/fa";
import { IoReloadCircle } from "react-icons/io5";
import ItemRegisterPartnerAdminPage from "./ItemRegisterPartnerAdmin";
import ReactPaginate from "react-paginate";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Swal from "sweetalert2";
import LoadingItem from "../loading/LoadingItem";

interface IDataRegisterPartner {
  id: string;
  name: string;
  numberCCCD: string;
  beforeImage: string;
  afterImage: string;
  status: string;
  idUser: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    password: string;
    phone: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    bio: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    emergencyPhone: string | null;
    address: string | null;
    role: string;
    status: string | null;
  };
}

const ListRegisterPartnerAdmin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpenApprove, setIsOpenAppove] = useState(false);

  const [filter, setFilter] = useState<string>("oldest");
  const [status, setStatus] = useState<string | null>(null);
  const [listRegPartner, setListRegPartner] = useState<
    IDataRegisterPartner[] | null
  >(null);

  const [itemRegPartner, setItemRegPartner] =
    useState<IDataRegisterPartner | null>(null);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [action, setAction] = useState<boolean>(true);
  const [isLoadingItem, setIsLoadingItem] = useState<boolean>(false);
  useEffect(() => {
    const currentFilter = searchParams.get("filter") || "oldest";
    setFilter(currentFilter);

    // Nếu cần thêm trạng thái:
    const currentStatus = searchParams.get("status") || null;
    setStatus(currentStatus);
    const currentPage = parseInt(searchParams.get("page") || "1");
    setPage(currentPage);
  }, [searchParams.toString()]);

  const handleOpenAppove = () => {
    setIsOpenAppove(true);
  };
  const handleClosenAppove = () => {
    setIsOpenAppove(false);
  };

  const getListRegPartner = async (
    status: string,
    filter: string,
    page: number
  ) => {
    setIsLoadingItem(true);
    const res = await apiRegisterPartner.getAllRegisterPartner(
      status,
      filter,
      page
    );

    console.log("res ", res);
    if (res?.status === "OK") {
      setListRegPartner(res?.data?.rows);
      setTotal(res?.data?.count);
      setLimit(res.limit);
    }
    setIsLoadingItem(false);
  };

  useEffect(() => {
    if (status === null) {
      {
        getListRegPartner("default", filter, page);
      }
    } else {
      getListRegPartner(status, filter, page);
    }
  }, [status, filter, page, action]);

  const handleUpdateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key === "status") {
      params.set("page", "1");
      setPage(1); // Đồng bộ state luôn
    }

    // Nếu không còn param nào → về /partner
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/ListRegisterPartner");
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/ListRegisterPartner");

    setPage(newPage);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn từ chối?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Thực hiện",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      setIsLoadingItem(true);
      const res = await apiRegisterPartner.cancel(id);
      if (res?.status === "OK") {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã xóa thành công!",
          confirmButtonText: "OK",
        });

        setAction(!action);
      } else {
        Swal.fire("Lỗi!", "Xóa không thành công.", "error");
      }
      setIsLoadingItem(false);
    }
  };

  return (
    <div className="w-full">
      <div className="p-10">
        <h1 className="text-2xl font-bold ">
          Danh sách yêu cầu đăng kí kinh doanh
        </h1>
        <div className="flex justify-between items-center mt-10">
          <div className="flex items-center gap-3">
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
         border-gray-500 text-black
        font-semibold rounded-xl bg-white text-sm shadow-sm 
        transition-transform active:scale-95
      `}
              onClick={() => setAction(!action)}
            >
              Tải lại
              <span>
                <IoReloadCircle />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
                            ${status === null ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} 
                            font-semibold rounded-xl bg-white text-sm shadow-sm 
                            transition-transform active:scale-95
                          `}
              // onClick={() => getListResApprove(filter)}
              onClick={() => handleUpdateParams("status", null)}
            >
              Tất cả
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
                            ${status === "request" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} 
                            font-semibold rounded-xl bg-white text-sm shadow-sm 
                            transition-transform active:scale-95
                          `}
              // onClick={() => getListResApprove(filter)}
              onClick={() => handleUpdateParams("status", "request")}
            >
              Đang chờ
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
                            ${status === "confirmed" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} 
                            font-semibold rounded-xl bg-white text-sm shadow-sm 
                            transition-transform active:scale-95
                          `}
              // onClick={() => getListResApprove(filter)}
              onClick={() => handleUpdateParams("status", "confirmed")}
            >
              Đã đồng ý
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
                            ${status === "rejected" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} 
                            font-semibold rounded-xl bg-white text-sm shadow-sm 
                            transition-transform active:scale-95
                          `}
              // onClick={() => getListResApprove(filter)}
              onClick={() => handleUpdateParams("status", "rejected")}
            >
              Đã từ chối
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 border border-gray-500 font-semibold rounded-xl">
              <FaFilter />
            </span>
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
                            ${filter === "oldest" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} 
                            font-semibold rounded-xl bg-white text-sm shadow-sm 
                            transition-transform active:scale-95
                          `}
              onClick={() => handleUpdateParams("filter", "oldest")}
            >
              Ngày tạo: cũ nhất
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border active:scale-95 transition-transform ${filter === "latest" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} font-semibold rounded-xl bg-white text-sm  shadow-sm  `}
              onClick={() => handleUpdateParams("filter", "latest")}
            >
              Ngày tạo: mới nhất
              <span>
                <FaCaretDown />
              </span>
            </button>
          </div>
        </div>
        <div className="overflow-hidden mt-8 rounded-xl">
          <table className="min-w-full text-black ">
            <thead className="bg-gray-200 text-[-14] text-gray-500 font-bold ">
              <tr>
                {/* <th className="px-4 py-3 text-left">
                  <input type="checkbox" />
                </th> */}
                <th className="px-4 py-3 text-left w-[160px]">Họ và tên</th>
                <th className="px-4 py-3 text-left w-[200px]">Email</th>
                <th className="px-4 py-3 text-left w-[140px]">Số điện thoại</th>
                <th className="px-4 py-3 text-left w-[140px]">Số CCCD</th>
                <th className="px-4 py-3 text-left w-[150px]">Yêu cầu</th>
                <th className="px-4 py-3 text-left w-[120px]">Trạng thái</th>
                <th className="px-4 py-3 text-left w-[160px]">Ngày tạo</th>
                <th className="px-4 py-3 text-left w-[80px]">...</th>
              </tr>
            </thead>
            {isLoadingItem === false && (
              <tbody className=" text-[-14] font-semibold ">
                {listRegPartner !== null &&
                  listRegPartner?.map((item, index: number) => {
                    return (
                      <tr key={index} className="border-b border-gray-200">
                        {/* <td className="px-4 py-5">
                        <input type="checkbox" />
                      </td> */}
                        <td className="px-4 py-5">
                          <div className="w-fit flex items-center gap-2 border border-b-[3px] border-gray-400 rounded-3xl py-1 px-3">
                            <img
                              src="https://a0.anyrgb.com/pngimg/1236/14/no-facial-features-no-avatar-no-eyes-expressionless-avatar-icon-delayering-avatar-user-avatar-men-head-portrait-thumbnail.png"
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <p>{`${item?.name}`}</p>
                          </div>
                        </td>
                        <td className="px-4 py-5 w-1/5">{item?.user?.email}</td>
                        <td className="px-4 py-5">{item?.user?.phone}</td>

                        <td className="px-4 py-5 ">{item?.numberCCCD}</td>

                        <td className={`px-4 py-5  text-green-500}`}>
                          Trở thành partner
                        </td>
                        <td
                          className={`px-4 py-5  ${item?.status === "request" ? "text-green-500" : item?.status === "rejected" ? "text-red-600" : "text-primary"}`}
                        >
                          {item?.status === "request"
                            ? "Đang chờ phê duyệt"
                            : item?.status === "rejected"
                              ? "Đã từ chối"
                              : "Đã phê duyệt"}
                        </td>
                        <td className="px-4 py-5">
                          {dayjs(item?.createdAt)?.format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td className="px-4 py-5 flex items-center gap-4">
                          <button
                            className={`w-fit py-2 px-2 rounded-3xl text-white font-semibold cursor-pointer min-w-32 bg-green-700`}
                            onClick={() => {
                              setItemRegPartner({
                                ...item,
                              });
                              handleOpenAppove();
                            }}
                          >
                            Chi tiết
                          </button>
                          <div
                            className="px-2 py-2 bg-red-600 text-white rounded-3xl cursor-pointer hover:opacity-70"
                            onClick={() => {
                              handleDelete(item?.idUser);
                            }}
                          >
                            {" "}
                            <FaTrashAlt />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>

        {listRegPartner?.length === 0 && (
          <div className="mt-3 flex justify-center text-xl">
            Chưa có người dùng nào đăng ký...
          </div>
        )}
        {isLoadingItem && (
          <div className="w-full flex justify-center">
            <LoadingItem />
          </div>
        )}
        {total !== null && total !== 0 && (
          <div className="mt-8 flex justify-center">
            <ReactPaginate
              pageCount={Math.ceil(total / limit)}
              forcePage={page - 1}
              onPageChange={handlePageChange}
              previousLabel={<GrFormPrevious className="text-2xl" />}
              nextLabel={<GrFormNext className="text-2xl" />}
              breakLabel="..."
              containerClassName="flex items-center space-x-2 "
              pageClassName="px-3 py-1 border border-gray-300 rounded-xl hover:bg-gray-100 cursor-pointer active:scale-95 transition-transform"
              activeClassName="bg-blue-500 text-white  hover:bg-blue-500 hover:text-black"
              previousClassName="px-1 py-1 border border-gray-300 rounded-xl hover:bg-gray-100 cursor-pointer active:scale-95 transition-transform"
              nextClassName="px-1 py-1 border border-gray-300 rounded-xl hover:bg-gray-100 cursor-pointer active:scale-95 transition-transform"
              breakClassName="px-2 py-1 border border-gray-300 rounded-xl bg-gray-100 cursor-default active:scale-95 transition-transform"
            />
          </div>
        )}
      </div>
      {isOpenApprove && itemRegPartner && (
        <ItemRegisterPartnerAdminPage
          data={itemRegPartner}
          handleCloseAppove={handleClosenAppove}
          setAction={setAction}
        />
      )}
    </div>
  );
};

export default ListRegisterPartnerAdmin;
