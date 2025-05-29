"use client";
import React, { useEffect } from "react";
import {
  Package,
  Hourglass,
  CheckCircle,
  XCircle,
  IndianRupee,
} from "@/components/icons";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import StatsCard from "@/components/dashboard/StatsCard";
import PieChart from "@/components/dashboard/PieChart";
import BarGraph from "@/components/dashboard/BarGraph";
import LineGraph from "@/components/dashboard/LineGraph";
import RecentOrders from "@/components/dashboard/RecentOrder";
import { getOrders } from "@/redux/slices/orderSlice";
import { fetchDashboardData } from "@/redux/slices/dashboardSlice";
import { formatNumberNPR } from "@/utils/formatNumberNpr";

export default function Admin() {
  const dispatch: AppDispatch = useDispatch();
  const { total, processingTotal, completedTotal, cancelledTotal } =
    useSelector((state: RootState) => state.order);
  const { data, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    console.log("Dashboard Data:", data);
  }, [data]);

  const topCategories = data?.topCategories || {};

  const orderDetails = {
    data: [processingTotal, completedTotal, cancelledTotal],
    label: ["Processing", "Completed", "Cancelled"],
    color: [
      "rgba(252, 211, 77, 1)",
      "rgba(134, 239, 172, 1)",
      "rgba(252, 165, 165, 1)",
    ],
  };
  const orderModeDetails = {
    data: [data?.paymentModes.cod, data?.paymentModes.esewa],
    label: ["Cash on Delevery", "Esewa"],
    color: ["rgba(74, 74, 74, 1)", "rgba(103, 191, 78, 1)"],
  };
  const topCategoryDetails = {
    data: Object.values(topCategories),
    label: Object.keys(topCategories),
    color: ["#86f0ad", "#FCA5A5", "#FBBF24", "#3B82F6", "#6B7280"],
  };
  const statsData = [
    {
      title: "Total Revenue",
      value: formatNumberNPR(data?.revenue.total ?? 0),
      icon: <IndianRupee size={20} />,
      color: "bg-emerald-500",
    },
    {
      title: "Total Orders",
      value: total,
      icon: <Package size={20} />,
      color: "bg-blue-300",
    },
    {
      title: "Processing",
      value: processingTotal,
      icon: <Hourglass size={20} />,
      color: "bg-yellow-300",
    },
    {
      title: "Delivered",
      value: completedTotal,
      icon: <CheckCircle size={20} />,
      color: "bg-green-300",
    },
    {
      title: "Cancelled",
      value: cancelledTotal,
      icon: <XCircle size={20} />,
      color: "bg-red-300",
    },
  ];

  const revenueLabels = data?.revenue.monthly?.labels ?? [];
  const revenueValue = data?.revenue.monthly?.values ?? [];

  useEffect(() => {
    dispatch(getOrders({ page: 1, limit: 10 }));
    dispatch(fetchDashboardData());
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto p-4 md:p-6 container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl text-gray-800 font-bold">
            Dashboard Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value ?? 0}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1 space-y-2">
            <div>
              <LineGraph
                labels={revenueLabels ?? []}
                revenue={revenueValue ?? []}
                title="Monthly Revenue (Last 6 Months)"
                error={error}
              />
            </div>
            <div>
              <BarGraph
                labels={data?.orderStatus.labels ?? []}
                completed={data?.orderStatus.completed ?? []}
                cancelled={data?.orderStatus.cancelled ?? []}
                title="Order Status (Last 6 Months)"
              />
            </div>
          </div>

          <div className="col-span-1 space-y-2">
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <PieChart
                  data={orderModeDetails.data.filter(
                    (value): value is number => value !== undefined
                  )}
                  labels={orderModeDetails.label}
                  colors={orderModeDetails.color}
                  title="Esewa vs COD"
                />
              </div>
              <div>
                <PieChart
                  data={Object.values(topCategories).filter(
                    (value): value is number => value !== undefined
                  )}
                  labels={Object.keys(topCategories)}
                  colors={topCategoryDetails.color}
                  title="Top Selling Categories"
                  error={error}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <PieChart
                  data={orderDetails.data}
                  labels={orderDetails.label}
                  colors={orderDetails.color}
                  title="Order Status"
                />
              </div>
              <div>
                <RecentOrders title={"Recent Orders"} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
