import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  labels: string[];
  revenue: number[];
  title: string;
  revenueColor?: string;
  error?: string | null;
}

const LineGraph: React.FC<LineGraphProps> = ({
  labels,
  revenue,
  title,
  revenueColor = "#00bc7d",
  error,
}) => {
  const formatChartData = () => {
    if (!revenue || !Array.isArray(revenue) || revenue.length === 0) {
      return {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: new Array(labels.length).fill(0),
            borderColor: revenueColor,
            backgroundColor: revenueColor,
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenue,
          borderColor: revenueColor,
          backgroundColor: revenueColor,
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  };

  const chartData = formatChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (₹)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (typeof error === "string" && error) {
    return (
      <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>
        <span className="flex items-center justify-center text-red-600 h-full">
          An error occurred
        </span>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>
      {revenue.length > 0 ? (
        <div className="h-64 flex items-center justify-center">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <span className="flex items-center justify-center text-red-600 h-full">
          Data is Empty
        </span>
      )}
    </div>
  );
};

export default LineGraph;
