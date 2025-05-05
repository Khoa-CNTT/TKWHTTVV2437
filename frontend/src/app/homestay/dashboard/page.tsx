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

// Tùy chọn biểu đồ
const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Báo cáo doanh thu theo tháng",
    },
  },
};

const Dashboard = () => {
  const [propertyId, setPropertyId] = useState<string>("");
  const { user } = useAuth();
  const [total, setTotal] = useState<ITotal>();
  const searchParams = useSearchParams(); // Lấy query từ URL
  const router = useRouter();

  const [barChart, setBarChart] = useState<IBarChar>(chartData);

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
        type: "month",
      });

      setBarChart({
        labels: response.data.labels,
        datasets: [
          {
            label: "Doanh thu",
            data: response.data.data,
            backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue with 60% opacity
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
    };

    fetDataBarChart();
  }, [propertyId]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "true") {
      toast.success("Thanh toán thành công");
      router.push("/homestay/dashboard");
    } else if (status === "false") {
      toast.error("Thanh toán thất bại");
      router.push("/homestay/dashboard");
    }
  }, [searchParams]);

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

            <div className="mt-8 w-full">
              <BarChartContainer data={barChart} options={chartOptions} />
            </div>

            <div className="mt-8">
              <TopRoomContainer propertyId={propertyId} />
            </div>
          </div>

          <div className="flex-2">
            <PayCommissionContainer userId={user?.id || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
