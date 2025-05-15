"use client";

import { useState, useEffect, Suspense } from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Pagination, Stack } from "@mui/material";
import { ICommissionPayment } from "@/app/types/commissionPayment";
import { useAuth } from "@/app/contexts/AuthContext";
import apisProperty from "@/apis/property";
import apisCommissionPayment from "@/apis/commissionPayment";
import MessageNotFound from "@/components/Item/MessageNotFound";
import clsx from "clsx";
import moment from "moment";
import PayingCommissionModal from "@/components/modal/PayingCommissionModal";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface IPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Tạo một component con để xử lý logic với useSearchParams
const PayCommissionContent = () => {
  const [pagination, setPagination] = useState<IPagination>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [propertyId, setPropertyId] = useState<string>("");
  const [dataCommissionPayment, setDataCommissionPayment] = useState<
    ICommissionPayment[]
  >([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("0");
  const [sort, setSort] = useState<string>("DESC");

  useEffect(() => {
    const fetchPropertyId = async (id: string) => {
      const response = await apisProperty.getPropertyIdByUserId(id);

      if (response.data) {
        setPropertyId(response.data.id);
      }
    };
    if (user?.id) {
      fetchPropertyId(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      const query: {
        page?: number;
        status?: string;
        sort?: string;
      } = {};

      if (currentPage) {
        query.page = currentPage;
      }

      if (status !== "0") {
        query.status = status;
      }

      if (sort) {
        query.sort = sort;
      }

      const response =
        await apisCommissionPayment?.getListCommissionPaymentByPropertyId(
          query,
          propertyId
        );
      setDataCommissionPayment(response?.data);
      setPagination(response?.pagination);
      setCurrentPage(response?.pagination?.currentPage);
    };

    fetchData();
  }, [propertyId, currentPage, sort, status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status, sort]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "true") {
      toast.success("Thanh toán thành công");
      router.push("/homestay/pay-commission");
    } else if (status === "false") {
      toast.error("Thanh toán thất bại");
      router.push("/homestay/pay-commission");
    }
  }, [searchParams]);

  return (
    <div className="relative w-full">
      <div className="p-2 mt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Thông tin thanh toán hoa hồng</h1>
        </div>

        <div className="flex justify-start px-4 gap-4 items-end mt-8">
          <div className="flex flex-col gap-1 w-[170px]">
            <label className="font-semibold text-md">Sắp xếp</label>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}
              sx={{
                "& .MuiSelect-select": {
                  padding: "10px", // Tùy chỉnh padding
                },
              }}
            >
              <MenuItem value={"DESC"}>Mới nhất</MenuItem>
              <MenuItem value={"ASC"}>Cũ nhất</MenuItem>
            </Select>
          </div>

          <div className="flex flex-col gap-1 w-[170px]">
            <label className="font-semibold text-md">Trạng thái</label>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
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

        <div className="overflow-hidden mt-4 rounded-xl">
          <table className="min-w-full text-black">
            <thead className="bg-gray-200 text-sm text-gray-500 font-bold ">
              <tr>
                <th className="px-4 py-3 text-left">STT</th>
                <th className="pl-4 py-3 text-left">Tháng</th>
                <th className="px-4 py-3 text-left">Doanh thu</th>
                <th className="px-4 py-3 text-left">Số đơn</th>
                <th className="px-4 py-3 text-left">Hoa hồng (%)</th>
                <th className="px-4 py-3 text-left">Phí hoa hồng</th>
                <th className="px-4 py-3 text-left">Phương thức</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
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
                      {item?.month}/{item?.year}
                    </td>
                    <td className="pl-4 py-5">
                      {item?.totalRevenue?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-5">{item?.orderQuantity}</td>
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
                      {item?.status === "pending" ? (
                        <button
                          onClick={() => setShowModal(true)}
                          className=" border-blue-500 border text-blue-700 hover:bg-blue-200 px-2 py-1 rounded-md"
                        >
                          Thanh toán
                          {showModal && (
                            <PayingCommissionModal
                              month={item.month}
                              year={item.year}
                              evenue={item.totalRevenue}
                              rateCommission={item.commissionRate}
                              quantity={item.orderQuantity}
                              onShowModal={setShowModal}
                              amount={item.commissionAmount}
                              id={item.id}
                              userId={user?.id || ""}
                            />
                          )}
                        </button>
                      ) : item?.status === "done" ? (
                        "Đã thanh toán"
                      ) : (
                        "Đã hủy"
                      )}
                    </td>
                    <td className="px-4 py-5">
                      {item?.paymentDate
                        ? moment(item?.paymentDate).format("HH:mm DD/MM/YYYY")
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
  );
};

// Component chính
const PayCommissionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayCommissionContent />
    </Suspense>
  );
};

export default PayCommissionPage;
