import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getOrders, Order } from "@/redux/slices/orderSlice";
import { formatNumberNPR } from "@/utils/formatNumberNpr";

interface RecentOrdersProps {
  title: string;
  currentPage?: number;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
  title,
  currentPage = 1,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getOrders({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const recentOrders = orders?.slice(0, 5) || [];

  if (typeof error === "string" && error) {
    return (
      <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>
        <span className="flex items-center justify-center text-red-600 h-64">
          An error occurred
        </span>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow p-4 scrollbar-hide">
      <h2 className="text-lg text-gray-800 font-semibold mb-4">{title}</h2>
      {loading ? (
        <span className="flex items-center justify-center text-gray-600 h-64">
          Loading...
        </span>
      ) : recentOrders.length > 0 ? (
        <div className="h-64 flex flex-col space-y-1 overflow-y-auto">
          {recentOrders.map((order: Order) => (
            <div
              key={order._id}
              className={`flex justify-between items-center p-1 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors`}
            >
              <div className="flex flex-col">
                <span
                  className={`text-sm text-gray-800 font-medium ${
                    order.status === "completed"
                      ? "text-green-500"
                      : order.status === "cancelled"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  #{order._id?.slice(0, 6)}
                </span>
                <span className="text-xs text-gray-500">{order.user.name}</span>
              </div>
              <span className="text-sm text-gray-800 font-medium">
                ₹ {formatNumberNPR(order.price)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className="flex items-center justify-center text-red-600 h-64">
          No orders available
        </span>
      )}
    </div>
  );
};

export default RecentOrders;
