"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const getTextColor = () => {
    return color.replace("bg-", "text-");
  };

  return (
    <div className="bg-white rounded-lg shadow  duration-300 p-4 w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 text-md font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${color} bg-opacity-15`}>
          <div className={`${getTextColor()}`}>{icon}</div>
        </div>
      </div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
        {value}
      </p>
    </div>
  );
};

export default StatsCard;
