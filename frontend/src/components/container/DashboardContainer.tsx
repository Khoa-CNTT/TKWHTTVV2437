"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import { Select, SelectItem } from '@nextui-org/react';
import apisAdmin from "@/api/admin";
interface StatisticsData {
  date: string;
  userCount: number;
  ownerCount: number;
  reservationCount: number;
}
type TimeFilter = "day" | "month" | "year";
const StatisticsChart = () => {
  const [data, setData] = useState<StatisticsData[]>([]);
  const [filter, setFilter] = useState<TimeFilter>("day"); // Xác định kiểu rõ ràng

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apisAdmin.getStatistics(filter);
      setData(response.data || []); // Đảm bảo luôn là mảng
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setData([]); // Reset data khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Lỗi: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Thống kê hệ thống</h3>
        <Select
          label="Chọn khoảng thời gian"
          className="w-48"
          selectedKeys={[filter]}
          onChange={(e) => setFilter(e.target.value as TimeFilter)} // Thêm type assertion
        >
          <SelectItem key="day" value="day">
            Theo ngày
          </SelectItem>
          <SelectItem key="month" value="month">
            Theo tháng
          </SelectItem>
          <SelectItem key="year" value="year">
            Theo năm
          </SelectItem>
        </Select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {data && data.length > 0 ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  filter === "month"
                    ? value.slice(5)
                    : filter === "year"
                      ? value
                      : value.slice(0, 10)
                }
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="userCount" name="Người dùng" fill="#8884d8" />
              <Bar dataKey="ownerCount" name="Chủ sở hữu" fill="#82ca9d" />
              <Bar dataKey="reservationCount" name="Đặt phòng" fill="#ffc658" />
            </BarChart>
          ) : (
            <div className="text-center py-8">Không có dữ liệu thống kê</div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsChart;
