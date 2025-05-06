import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Props cho component BarChart
interface BarChartProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
  title?: string;
}

const BarChartContainer: React.FC<BarChartProps> = ({
  data,
  options,
  title,
}) => {
  // Cấu hình mặc định
  const defaultOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    ...options, // Ghi đè bằng options từ props nếu có
  };

  return <Bar data={data} options={defaultOptions} />;
};

export default BarChartContainer;
