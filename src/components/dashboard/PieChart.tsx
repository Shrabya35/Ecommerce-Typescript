import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: number[];
  labels: string[];
  colors: string[];
  title: string;
  error?: string | null;
}

const PieChart: React.FC<ChartProps> = ({
  data,
  labels,
  colors,
  title,
  error,
}) => {
  const formatChartData = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        labels,
        datasets: [
          {
            data: new Array(labels.length).fill(0),
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = formatChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // cutout: "70%",
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  if (typeof error === "string" && error) {
    return (
      <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>
        <span className="flex items-center justify-center text-red-600 h-full">
          an error occurred
        </span>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      ) : (
        <span className="flex items-center justify-center text-red-600 h-full">
          Data is Empty
        </span>
      )}
    </div>
  );
};

export default PieChart;
