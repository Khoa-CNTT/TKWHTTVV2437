"use client";

import { useEffect, useState } from "react";
import { MdOutlineBook } from "react-icons/md";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { IoMdBed } from "react-icons/io";
import { MdOutlineHomeWork } from "react-icons/md";
import BarChartContainer from "@/components/container/BarChartContainer";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import PayCommissionContainer from "@/components/container/PayCommissionContainer";
import apisProperty from "@/apis/property";
import TopRoomContainer from "@/components/container/TopRoomContainer";
import { useAuth } from "@/app/contexts/AuthContext";
import apisReservation from "@/apis/reservation";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

interface ITotal {
  review: { averageRating: string };
  totalBooking: number;
  totalRoom: number;
  totalRoomType: number;
}

interface IBarChar {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const chartData = {
  labels: [
    "06/2024",
    "07/2024",
    "08/2024",
    "09/2024",
    "10/2024",
    "11/2024",
    "12/2024",
    "01/2025",
    "02/2025",
    "03/2025",
    "04/2025",
    "05/2025",
  ],
  datasets: [
    {
      label: "Doanh thu",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue with 60% opacity
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const chartDataCommission = {
  labels: [
    "06/2024",
    "07/2024",
    "08/2024",
    "09/2024",
    "10/2024",
    "11/2024",
    "12/2024",
    "01/2025",
    "02/2025",
    "03/2025",
    "04/2025",
    "05/2025",
  ],
  datasets: [
    {
      label: "Biểu đồ tiền hoa hồng",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(255, 99, 132, 0.6)", // Màu đỏ với 60% opacity
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
    },
  ],
};

// Tùy chọn biểu đồ
const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ doanh thu",
    },
  },
};

// Tùy chọn biểu đồ
const chartOptions2 = {
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ tiền hoa hồng",
    },
  },
};

const DashboardOwner = () => {
  const [propertyId, setPropertyId] = useState<string>("");
  const { user } = useAuth();
  const [total, setTotal] = useState<ITotal>();
  const searchParams = useSearchParams(); // Lấy query từ URL
  const router = useRouter();
  const [type, setType] = useState<string>("month");
  const [typeCommission, setTypeCommission] = useState<string>("month");

  const [barChart, setBarChart] = useState<IBarChar>(chartData);
  const [barChartCommission, setBarChartCommission] =
    useState<IBarChar>(chartDataCommission);

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
    const fetchDataTotal = async () => {
      const response =
        await apisProperty.getTotalDashboardByPropertyId(propertyId);

      setTotal(response.data);
    };

    fetchDataTotal();
  }, [propertyId]);

  useEffect(() => {
    const fetDataBarChart = async () => {
      const response = await apisReservation.getDataBarChart(propertyId, {
        type: type,
      });

      setBarChart({
        labels: response.data.labels,
        datasets: [
          {
            label: "Biểu đồ doanh thu",
            data: response.data.data,
            backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue with 60% opacity
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
          },
        ],
      });
    };

    fetDataBarChart();
  }, [propertyId, type]);

  useEffect(() => {
    const fetDataBarChart = async () => {
      const response = await apisReservation.getDataBarChart(propertyId, {
        type: typeCommission,
      });

      console.log({
        response: response?.data?.data?.map((item: any) => item * 0.1),
      });

      setBarChartCommission({
        labels: response.data.labels,
        datasets: [
          {
            label: "Tiền hoa hồng",
            data: response.data.data.map((item: any) => item * 0.1),
            backgroundColor: "rgba(255, 99, 132, 0.6)", // Màu đỏ với 60% opacity
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
          },
        ],
      });
    };

    fetDataBarChart();
  }, [propertyId, typeCommission]);

  return (
    <div className="w-full">
      <div className="p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Thống kê</h1>
        </div>

        <div className="flex gap-6">
          <div className="flex-8">
            <div className="mt-4 flex items-center gap-6">
              <div className="flex gap-2 border border-gray-300 p-5 rounded-lg items-center">
                <MdOutlineBook size={50} />

                <div>
                  <p className="text-gray-500 font-semibold">Tổng đặt</p>

                  <p className="text-2xl font-semibold">
                    {total?.totalBooking || 0}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 border border-gray-300 p-5 rounded-lg items-center">
                <MdOutlineHomeWork size={50} />

                <div>
                  <p className="text-gray-500 font-semibold">Loại phòng</p>

                  <p className="text-2xl font-semibold">
                    {total?.totalRoomType || 0}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 border border-gray-300 p-5 rounded-lg items-center">
                <IoMdBed size={50} />

                <div>
                  <p className="text-gray-500 font-semibold">Số lượng phòng</p>

                  <p className="text-2xl font-semibold">
                    {total?.totalRoomType || 0}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 border border-gray-300 p-5 rounded-lg items-center">
                <FaRegStarHalfStroke size={50} />

                <div>
                  <p className="text-gray-500 font-semibold">Đánh giá</p>

                  <p className="text-2xl font-semibold">
                    {total?.review.averageRating || 0}/5
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="mt-8 w-full">
                <div className="flex justify-end">
                  <ul className="flex items-center gap-4 font-semibold">
                    <li
                      className={clsx(
                        "cursor-pointer",
                        type === "month" ? "text-blue-600" : "text-gray-500"
                      )}
                      onClick={() => setType("month")}
                    >
                      Tháng
                    </li>
                    <li
                      className={clsx(
                        "cursor-pointer",
                        type === "quarter" ? "text-blue-600" : "text-gray-500"
                      )}
                      onClick={() => setType("quarter")}
                    >
                      Quý
                    </li>
                    <li
                      className={clsx(
                        "cursor-pointer",
                        type === "year" ? "text-blue-600" : "text-gray-500"
                      )}
                      onClick={() => setType("year")}
                    >
                      Năm
                    </li>
                  </ul>
                </div>
                <BarChartContainer data={barChart} options={chartOptions} />
              </div>
              <div className="mt-8 w-full">
                <div className="flex justify-end">
                  <ul className="flex items-center gap-4 font-semibold">
                    <li
                      className={clsx(
                        "cursor-pointer",
                        typeCommission === "month"
                          ? "text-blue-600"
                          : "text-gray-500"
                      )}
                      onClick={() => setTypeCommission("month")}
                    >
                      Tháng
                    </li>
                    <li
                      className={clsx(
                        "cursor-pointer",
                        typeCommission === "quarter"
                          ? "text-blue-600"
                          : "text-gray-500"
                      )}
                      onClick={() => setTypeCommission("quarter")}
                    >
                      Quý
                    </li>
                    <li
                      className={clsx(
                        "cursor-pointer",
                        typeCommission === "year"
                          ? "text-blue-600"
                          : "text-gray-500"
                      )}
                      onClick={() => setTypeCommission("year")}
                    >
                      Năm
                    </li>
                  </ul>
                </div>
                <BarChartContainer
                  data={barChartCommission}
                  options={chartOptions2}
                />
              </div>
            </div>

            <div className="mt-8">
              <TopRoomContainer propertyId={propertyId} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <TopRoomContainer propertyId={propertyId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOwner;
