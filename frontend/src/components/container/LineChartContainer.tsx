import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Props cho component LineChart
interface LineChartProps {
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
  title?: string;
}

const LineChartContainer: React.FC<LineChartProps> = ({
  data,
  options,
  title,
}) => {
  // Cấu hình mặc định
  const defaultOptions: ChartOptions<"line"> = {
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

  return <Line data={data} options={defaultOptions} />;
};

export default LineChartContainer;
