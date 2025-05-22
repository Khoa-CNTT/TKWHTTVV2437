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
import ItemReservationAdmin from "./ItemReservationAdmin";
import apiProperty from "@/api/property";
import LoadingItem from "../loading/LoadingItem";

interface IBooking {
  id: string;
  idUser: string;
  idRoom: string;
  checkIndate: string; // ISO string
  checkOutdate: string; // ISO string
  numGuest: number | null;
  totalPrice: number;
  status: string;
  message: string;
  nameAccount: string;
  numberAccount: string;
  nameBank: string;
  statusUser: string;
  returnImgBanking: string | null;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageBanking: string;
  reason: string | null;
  idProperty: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  rooms: {
    id: string;
    name: string;
  };
  users: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  properties: {
    id: string;
    name: string;
    users: {
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
    };
  };
}

const ListReservationApprovePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpenApprove, setIsOpenAppove] = useState(false);

  const [filter, setFilter] = useState<string>("oldest");

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [action, setAction] = useState<boolean>(false);

  const [dataBooking, setDataBooking] = useState<IBooking[] | null>(null);
  const [itemBooking, setItemBooking] = useState<IBooking | null>(null);
  const [properties, setProperties] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [isLoadingItem, setIsLoadingItem] = useState<boolean>(false);
  useEffect(() => {
    const currentFilter = searchParams.get("filter") || "oldest";
    setFilter(currentFilter);

    const currentPropertyId = searchParams.get("propertyId") || "";
    setSelectedPropertyId(currentPropertyId);

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

    if (key === "propertyId") {
      params.set("page", "1");
      setPage(1); // Đồng bộ state luôn
    }

    // Nếu không còn param nào → về /partner
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/Reservation");
  };

  const handleOpenAppove = () => {
    setIsOpenAppove(true);
  };
  const handleClosenAppove = () => {
    setIsOpenAppove(false);
  };

  const getAllReservationByAdmin = async (
    idProperty: string,
    filter: string,
    page: number
  ) => {
    setIsLoadingItem(true);
    const res = await apiReservation.getAllReservationByAdmin(
      idProperty,
      filter,
      page
    );
    if (res?.status === "OK" && res?.data !== null) {
      setDataBooking(res?.data?.rows);
      setTotal(res?.data?.count);
    }
    setIsLoadingItem(false);
  };

  const getAllPropertyByAdmin = async () => {
    setIsLoadingItem(true);
    const res = await apiProperty.getAllPropertyByAdmin();
    if (res?.status === "OK") {
      setProperties(res?.data);
    }
    setIsLoadingItem(false);
  };
  useEffect(() => {
    getAllPropertyByAdmin();
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      getAllReservationByAdmin(selectedPropertyId, filter, page);
    } else {
      getAllReservationByAdmin("0", filter, page);
    }
  }, [selectedPropertyId, page, filter, action]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/Reservation");

    setPage(newPage);
  };

  return (
    <div className="w-full">
      <div className="p-10">
        <h1 className="text-2xl font-bold ">Danh sách các đơn đặt phòng</h1>
        <div className="mt-4">
          <label className="font-semibold mr-2 ">Lọc theo homestay:</label>
          <select
            className="border px-4 py-2 rounded-md "
            value={selectedPropertyId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPropertyId(e.target.value);
              const params = new URLSearchParams(searchParams.toString());
              if (value) {
                params.set("propertyId", value);
              } else {
                params.delete("propertyId");
              }
              // Reset page về 1 khi filter thay đổi
              params.set("page", "1");

              router.push(`?${params.toString()}`);
            }}
          >
            <option value="">-- Tất cả --</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center mt-4">
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
                <th className="px-4 py-3 text-left w-[250px]">
                  Homestay/Resort
                </th>

                <th className="px-4 py-3 text-left w-[250px]">
                  Email khách hàng
                </th>
                <th className="px-4 py-3 text-left w-[150px]">Check In</th>

                <th className="px-4 py-3 text-left w-[140px]">Tổng tiền</th>
                <th className="px-4 py-3 text-left w-[100px]">Yêu cầu</th>
                <th className="px-4 py-3 text-left w-[150px]">Ngày đặt</th>
                <th className="px-4 py-3 text-left w-[80px]">...</th>
              </tr>
            </thead>
            {isLoadingItem === false && (
              <tbody className=" text-[-14] font-semibold ">
                {dataBooking !== null &&
                  dataBooking?.map((item, index: number) => {
                    return (
                      <tr key={index} className="border-b border-gray-200">
                        {/* <td className="px-4 py-5">
                        <input type="checkbox" />
                      </td> */}
                        <td className="px-4 py-5">{item?.code}</td>
                        <td className="px-4 py-5 ">{item?.properties?.name}</td>
                        <td className="px-4 py-5">
                          <div className="w-fit flex items-center gap-2 border border-b-[3px] border-gray-400 rounded-3xl py-1 px-3">
                            <p>{`${item?.users?.email}`}</p>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          {dayjs(item?.checkIndate)?.format("DD/MM/YYYY HH:mm")}
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
                            className={`w-fit py-2 px-4 rounded-3xl text-white font-semibold cursor-pointer min-w-32 bg-green-700`}
                            onClick={() => {
                              setItemBooking({ ...item });
                              handleOpenAppove();
                            }}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
        {dataBooking?.length === 0 && (
          <div className="mt-3 flex justify-center text-xl">
            Chưa có đơn đặt nào...
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
      {isOpenApprove && itemBooking && (
        <ItemReservationAdmin
          data={itemBooking}
          handleCloseAppove={handleClosenAppove}
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
