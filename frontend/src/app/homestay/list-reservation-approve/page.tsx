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
  const searchParams = useSearchParams();
  const [isOpenApprove, setIsOpenAppove] = useState(false);
  const [listResApprove, setListResApprove] = useState<IReservationApprove[]>();
  const { reservation, setReservation } = useReservationContext();
  const [filter, setFilter] = useState<string>("oldest");

  useEffect(() => {
    setFilter(searchParams?.get("filter") || "oldest");
  }, [searchParams?.get("filter")]);

  const handleOpenAppove = () => {
    setIsOpenAppove(true);
  };
  const handleClosenAppove = () => {
    setIsOpenAppove(false);
  };

  const getListResApprove = async (filter: string) => {
    const res = await apiReservation.listReservationApprove(filter);

    setListResApprove(res?.data?.rows);
  };
  useEffect(() => {
    getListResApprove(filter);
  }, [reservation, filter]);

  // console.log(listResApprove);

  const handleFilter = (value: string) => {
    // console.log("value ", value);
    router.push(`?filter=${value}`);
  };

  // console.log("filter ", filter);

  return (
    <div className="w-full">
      <div className="p-10">
        <h1 className="text-2xl font-bold ">Danh sách cần phê duyệt</h1>
        <div className="flex justify-between items-center mt-10">
          <div>
            <button
              className={`flex items-center gap-1 px-4 py-2 border 
         border-primary text-primary
        font-semibold rounded-xl bg-white text-sm shadow-sm 
        transition-transform active:scale-95
      `}
              onClick={() => getListResApprove(filter)}
            >
              Tải lại
              <span>
                <IoReloadCircle />
              </span>
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
              onClick={() => handleFilter("oldest")}
            >
              Ngày đặt: cũ nhất
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border active:scale-95 transition-transform ${filter === "latest" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} font-semibold rounded-xl bg-white text-sm  shadow-sm  `}
              onClick={() => handleFilter("latest")}
            >
              Ngày đặt: mới nhất
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border active:scale-95 transition-transform ${filter === "price-asc" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} font-semibold rounded-xl bg-white text-sm  shadow-sm  `}
              onClick={() => handleFilter("price-asc")}
            >
              Tổng tiền: tăng dần
              <span>
                <FaCaretDown />
              </span>
            </button>
            <button
              className={`flex items-center gap-1 px-4 py-2 border active:scale-95 transition-transform ${filter === "price-desc" ? "border-primary text-primary" : "border-gray-500 hover:bg-gray-100 text-gray-700"} font-semibold rounded-xl bg-white text-sm  shadow-sm  `}
              onClick={() => handleFilter("price-desc")}
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
                <th className="px-4 py-3 text-left">Mã đơn</th>
                <th className="px-4 py-3 text-left ">Loại phòng</th>
                <th className="px-4 py-3 text-left ">Tên khách hàng</th>

                <th className="px-4 py-3 text-left ">Check In</th>
                <th className="px-4 py-3 text-left ">Check Out</th>
                <th className="px-4 py-3 text-left ">Tổng tiền</th>
                <th className="px-4 py-3 text-left ">Yêu cầu</th>
                <th className="px-4 py-3 text-left ">Ngày đặt</th>
                <th className="px-4 py-3 text-left ">...</th>
              </tr>
            </thead>
            <tbody className=" text-[-14] font-semibold ">
              {listResApprove != null &&
                listResApprove?.map((item, index: number) => {
                  return (
                    <tr key={index} className="border-b border-gray-200">
                      {/* <td className="px-4 py-5">
                        <input type="checkbox" />
                      </td> */}
                      <td className="px-4 py-5">{item?.code}</td>
                      <td className="px-4 py-5 w-1/5">{item?.rooms?.name}</td>
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
                        {dayjs(item?.checkOutdate)?.format("DD/MM/YYYY HH:mm")}
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
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenApprove && (
        <ConfirmApprove handleCloseAppove={handleClosenAppove} />
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
