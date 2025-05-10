"use client";

import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaPersonShelter } from "react-icons/fa6";
import clsx from "clsx";
import BarChartContainer from "@/components/container/BarChartContainer";

import LineChartContainer from "@/components/container/LineChartContainer";
import apisUser from "@/apis/user";
import apisAdOrder from "@/apis/adOrder";
import apisCommissionPayment from "@/apis/commissionPayment";

interface IChar {
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
    {
      label: "Doanh thu",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

// Tùy chọn biểu đồ
const chartOptions = {
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ tăng trưởng khách hàng và chủ sỡ hữu",
    },
  },
};

const chartOptionsAd = {
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ doanh thu từ gói quảng cáo",
    },
  },
};

const chartOptionsCommission = {
  plugins: {
    title: {
      display: true,
      text: "Biểu đồ doanh thu từ phí hoa hồng",
    },
  },
};

const DashboardPage = () => {
  const [lineChart, setLineChart] = useState<IChar>(chartData);
  const [total, setTotal] = useState<{
    totalUser: number;
    totalProperty: number;
  }>();
  const [type, setType] = useState<string>("day");
  const [typeAd, setTypeAd] = useState<string>("month");
  const [barChartAd, setBarChartAd] = useState<IChar>(chartData);
  const [barChartCommission, setBarChartCommission] =
    useState<IChar>(chartData);
  const [typeCommission, setTypeCommission] = useState<string>("month");

  useEffect(() => {
    const fetchDataTotal = async () => {
      const response = await apisUser.getTotalDashboardAdmin();

      console.log({ response });

      setTotal(response?.data);
    };

    fetchDataTotal();
  }, []);

  useEffect(() => {
    const fetchDataLineChart = async () => {
      const response = await apisUser.getDataLineChart({
        type: type,
      });

      if (response?.data) {
        setLineChart({
          labels: response.data.labels,
          datasets: [
            {
              label: "Khách hàng",
              data: response.data.dataUser,
              backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue with 60% opacity
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
            },
            {
              label: "Chủ sở hữu",
              data: response.data.dataProperty,
              backgroundColor: "rgba(255, 99, 132, 0.6)", // Màu đỏ với 60% opacity
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
            },
          ],
        });
      }
    };

    fetchDataLineChart();
  }, [type]);

  useEffect(() => {
    const fetDataBarChart = async () => {
      const response = await apisAdOrder.getDataBarChartAdmin({
        type: typeAd,
      });

      setBarChartAd({
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
  }, [typeAd]);

  useEffect(() => {
    const fetDataBarChart = async () => {
      const response = await apisCommissionPayment.getDataBarChartAdmin({
        type: typeAd,
      });

      setBarChartCommission({
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
  }, [typeCommission, typeAd]);

  return (
    <div>
      <div className="w-full">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Thống kê</h1>
          </div>

          <div className="mt-4 flex items-center gap-6">
            <div className="flex gap-2 border border-gray-300 p-5 rounded-lg items-center">
              <FaRegUser size={50} />

              <div>
                <p className="text-gray-500 font-semibold">Tổng khách hàng</p>

                <p className="text-2xl font-semibold">
                  {total?.totalUser || 0}
                </p>
              </div>
            </div>

            <div className="flex gap-2 border border-gray-300 p-5 rounded-lg items-center">
              <FaPersonShelter size={50} />
              <div>
                <p className="text-gray-500 font-semibold">Tổng chủ sở hữu</p>

                <p className="text-2xl font-semibold">
                  {total?.totalProperty || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 w-[80%]">
            <div className="flex justify-end">
              <ul className="flex items-center gap-4 font-semibold">
                <li
                  className={clsx(
                    "cursor-pointer",
                    type === "day" ? "text-blue-600" : "text-gray-500"
                  )}
                  onClick={() => setType("day")}
                >
                  Ngày
                </li>
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
                    type === "year" ? "text-blue-600" : "text-gray-500"
                  )}
                  onClick={() => setType("year")}
                >
                  Năm
                </li>
              </ul>
            </div>
            <LineChartContainer data={lineChart} options={chartOptions} />
          </div>

          <div className="mt-8 w-full flex gap-6">
            <div className="flex-1">
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
                options={chartOptionsCommission}
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-end">
                <ul className="flex items-center gap-4 font-semibold">
                  <li
                    className={clsx(
                      "cursor-pointer",
                      typeAd === "month" ? "text-blue-600" : "text-gray-500"
                    )}
                    onClick={() => setTypeAd("month")}
                  >
                    Tháng
                  </li>
                  <li
                    className={clsx(
                      "cursor-pointer",
                      typeAd === "quarter" ? "text-blue-600" : "text-gray-500"
                    )}
                    onClick={() => setTypeAd("quarter")}
                  >
                    Quý
                  </li>
                  <li
                    className={clsx(
                      "cursor-pointer",
                      typeAd === "year" ? "text-blue-600" : "text-gray-500"
                    )}
                    onClick={() => setTypeAd("year")}
                  >
                    Năm
                  </li>
                </ul>
              </div>
              <BarChartContainer data={barChartAd} options={chartOptionsAd} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
