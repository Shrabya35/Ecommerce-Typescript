import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarGraphProps {
  labels: string[];
  completed: number[];
  cancelled: number[];
  title: string;
  completedColor?: string;
  cancelledColor?: string;
  error?: string | null;
}

const BarGraph: React.FC<BarGraphProps> = ({
  labels,
  completed,
  cancelled,
  title,
  completedColor = "#86f0ad",
  cancelledColor = "#FCA5A5",
  error,
}) => {
  const formatChartData = () => {
    if (
      !completed ||
      !cancelled ||
      !Array.isArray(completed) ||
      !Array.isArray(cancelled) ||
      completed.length === 0 ||
      cancelled.length === 0
    ) {
      return {
        labels,
        datasets: [
          {
            label: "Completed",
            data: new Array(labels.length).fill(0),
            backgroundColor: completedColor,
            borderWidth: 1,
          },
          {
            label: "Cancelled",
            data: new Array(labels.length).fill(0),
            backgroundColor: cancelledColor,
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: "Completed",
          data: completed,
          backgroundColor: completedColor,
          borderWidth: 1,
        },
        {
          label: "Cancelled",
          data: cancelled,
          backgroundColor: cancelledColor,
          borderWidth: 1,
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Orders",
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
          an error occurred
        </span>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>
      {completed.length > 0 && cancelled.length > 0 ? (
        <div className="h-64 flex items-center justify-center">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <span className="flex items-center justify-center text-red-600 h-full">
          Data is Empty
        </span>
      )}
    </div>
  );
};

export default BarGraph;
