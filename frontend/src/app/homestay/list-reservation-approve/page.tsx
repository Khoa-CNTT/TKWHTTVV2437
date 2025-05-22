"use client";

import { Suspense } from "react";
import { FaCaretDown } from "react-icons/fa";
import ConfirmApprove from "@/components/MangeAprove/ConfirmApprove";
import { useEffect, useState } from "react";
import apiReservation from "@/api/reservation";
import { IReservation } from "@/app/types/reservation";
import { useReservationContext } from "@/app/contexts/ReservationContext";
import dayjs from "dayjs";
import { FaFilter } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { IoReloadCircle } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useAuth } from "@/app/contexts/AuthContext";
import LoadingItem from "@/components/loading/LoadingItem";

interface IReservationApprove {
  id: string;
  idUser: string;
  idRoom: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageBanking: string | null;
  message: string | null;
  numberAccount: string;
  nameAccount: string;
  nameBank: string;
  statusUser: string;
  code: string;
  returnImgBanking: string | null;
  reason: string | null;
  checkIndate: string; // ISO format from backend
  checkOutdate: string;
  numGuest: number | null;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  rooms: {
    name: string;
    price: number;
  };
}

const ListReservationApprovePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [isOpenApprove, setIsOpenAppove] = useState(false);
  const [listResApprove, setListResApprove] = useState<IReservationApprove[]>();
  const { reservation, setReservation } = useReservationContext();
  const [filter, setFilter] = useState<string>("oldest");
  const [status, setStatus] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [action, setAction] = useState<boolean>(false);
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
    router.push(
      queryString ? `?${queryString}` : "/homestay/list-reservation-approve"
    );
  };

  const handleOpenAppove = () => {
    setIsOpenAppove(true);
  };
  const handleClosenAppove = () => {
    setIsOpenAppove(false);
  };

  const getListResApprove = async (
    filter: string,
    status: string,
    page: number,
    idUser: string
  ) => {
    setIsLoadingItem(true);
    const res = await apiReservation.listReservationApprove(
      filter,
      status,
      page,
      idUser
    );
    if (res?.status === "OK") {
      setListResApprove(res?.data?.rows);
      setTotal(res?.data?.count);
    }
    setIsLoadingItem(false);
  };
  useEffect(() => {
    if (user) {
      if (status === null) {
        getListResApprove(filter, "waiting", page, user.id);
      } else {
        getListResApprove(filter, status, page, user.id);
      }
    }
  }, [reservation, filter, status, page, action, user]);

  // console.log(listResApprove);

  // console.log("filter ", filter);
  const handlePageChange = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    const queryString = params.toString();
    router.push(
      queryString ? `?${queryString}` : "/homestay/list-reservation-approve"
    );

    setPage(newPage);
  };
  console.log("list ", listResApprove);
  return (
    <div className="w-full">
      <div className="p-10">
        <h1 className="text-2xl font-bold ">Danh sách cần phê duyệt</h1>
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
              Đang chờ xử lí
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
                            ${status === "handle" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} 
                            font-semibold rounded-xl bg-white text-sm shadow-sm 
                            transition-transform active:scale-95
                          `}
              // onClick={() => getListResApprove(filter)}
              onClick={() => handleUpdateParams("status", "handle")}
            >
              Đã xử lí
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
              Ngày đặt: cũ nhất
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border active:scale-95 transition-transform ${filter === "latest" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} font-semibold rounded-xl bg-white text-sm  shadow-sm  `}
              onClick={() => handleUpdateParams("filter", "latest")}
            >
              Ngày đặt: mới nhất
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border active:scale-95 transition-transform ${filter === "price-asc" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} font-semibold rounded-xl bg-white text-sm  shadow-sm  `}
              onClick={() => handleUpdateParams("filter", "price-asc")}
            >
              Tổng tiền: tăng dần
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border active:scale-95 transition-transform ${filter === "price-desc" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} font-semibold rounded-xl bg-white text-sm  shadow-sm  `}
              onClick={() => handleUpdateParams("filter", "price-desc")}
            >
              Tổng tiền: giảm dần
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
                <th className="px-4 py-3 text-left w-[100px]">Mã đơn</th>
                <th className="px-4 py-3 text-left w-[200px]">Loại phòng</th>
                <th className="px-4 py-3 text-left w-[180px]">
                  Tên khách hàng
                </th>
                <th className="px-4 py-3 text-left w-[150px]">Check In</th>
                <th className="px-4 py-3 text-left w-[150px]">Check Out</th>
                <th className="px-4 py-3 text-left w-[140px]">Tổng tiền</th>
                <th className="px-4 py-3 text-left w-[100px]">Yêu cầu</th>
                <th className="px-4 py-3 text-left w-[150px]">Ngày đặt</th>
                <th className="px-4 py-3 text-left w-[80px]">...</th>
              </tr>
            </thead>
            {isLoadingItem === false && (
              <tbody className="text-[-14] font-semibold ">
                {listResApprove !== null &&
                  listResApprove?.map((item, index: number) => {
                    return (
                      <tr key={index} className="border-b border-gray-200">
                        {/* <td className="px-4 py-5">
                        <input type="checkbox" />
                      </td> */}
                        <td className="px-4 py-5">{item?.code}</td>
                        <td className="px-4 py-5 ">{item?.rooms?.name}</td>
                        <td className="px-4 py-5">
                          <div className="w-fit flex items-center gap-2 border border-b-[3px] border-gray-400 rounded-3xl py-1 px-3">
                            <img
                              src="https://a0.anyrgb.com/pngimg/1236/14/no-facial-features-no-avatar-no-eyes-expressionless-avatar-icon-delayering-avatar-user-avatar-men-head-portrait-thumbnail.png"
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <p>{`${item?.firstName} ${item?.lastName}`}</p>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          {dayjs(item?.checkIndate)?.format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td className="px-4 py-5">
                          {dayjs(item?.checkOutdate)?.format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </td>
                        <td className="px-4 py-5 ">
                          {item?.totalPrice?.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>

                        <td
                          className={`px-4 py-5  ${item?.statusUser === "created" ? "text-green-500" : "text-red-600"}`}
                        >
                          {item?.statusUser === "created" ? "Đặt" : "Hủy"}
                        </td>
                        <td className="px-4 py-5">
                          {dayjs(item?.createdAt)?.format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td className="px-4 py-5 ">
                          {status === null ? (
                            <button
                              className={`w-fit py-2 px-4 rounded-3xl text-white font-semibold cursor-pointer min-w-32 ${item?.statusUser === "created" ? "bg-green-700" : "bg-red-600"}`}
                              onClick={() => {
                                setReservation({
                                  id: item?.id,
                                  nameRoom: item?.rooms?.name,
                                  firstName: item?.firstName,
                                  lastName: item?.lastName,
                                  message: item?.message,
                                  checkIn: dayjs(item?.checkIndate),
                                  checkOut: dayjs(item?.checkOutdate),
                                  totalPrice: item?.totalPrice,
                                  status: item?.status,
                                  email: item?.email,
                                  phone: item?.phone,
                                  imageBanking: item?.imageBanking,
                                  createdAt: dayjs(item?.createdAt),
                                  numberAccount: item?.numberAccount,
                                  nameAccount: item?.nameAccount,
                                  nameBank: item?.nameBank,
                                  statusUser: item?.statusUser,
                                  code: item?.code,
                                });
                                handleOpenAppove();
                              }}
                            >
                              {item?.statusUser === "created"
                                ? "Phê duyệt"
                                : "Hoàn tiền"}
                            </button>
                          ) : (
                            <button
                              className={`w-fit py-2 px-4 rounded-3xl text-white font-semibold cursor-pointer min-w-32  ${item?.statusUser === "created" ? "bg-green-700" : "bg-red-600"}`}
                              onClick={() => {
                                setReservation({
                                  id: item?.id,
                                  nameRoom: item?.rooms?.name,
                                  firstName: item?.firstName,
                                  lastName: item?.lastName,
                                  message: item?.message,
                                  checkIn: dayjs(item?.checkIndate),
                                  checkOut: dayjs(item?.checkOutdate),
                                  totalPrice: item?.totalPrice,
                                  status: item?.status,
                                  email: item?.email,
                                  phone: item?.phone,
                                  imageBanking: item?.imageBanking,
                                  createdAt: dayjs(item?.createdAt),
                                  numberAccount: item?.numberAccount,
                                  nameAccount: item?.nameAccount,
                                  nameBank: item?.nameBank,
                                  statusUser: item?.statusUser,
                                  code: item?.code,
                                  returnImgBanking: item?.returnImgBanking,
                                  reason: item?.reason,
                                });
                                handleOpenAppove();
                              }}
                            >
                              {item?.status === "confirmed"
                                ? "Đã phê duyệt"
                                : item?.status === "reject"
                                  ? "Đã từ chối"
                                  : "Đã hoàn tiền"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
          {listResApprove?.length === 0 && (
            <div className="mt-3 flex justify-center text-xl">
              Chưa có đơn đặt nào...
            </div>
          )}
          {isLoadingItem && (
            <div className="w-full flex justify-center">
              <LoadingItem />
            </div>
          )}
        </div>
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
      {isOpenApprove && (
        <ConfirmApprove
          handleCloseAppove={handleClosenAppove}
          status={status}
        />
      )}
    </div>
  );
};

const ListReservationApproveContent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListReservationApprovePage />
    </Suspense>
  );
};

export default ListReservationApproveContent;
