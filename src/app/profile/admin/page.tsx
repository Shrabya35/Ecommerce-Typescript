import {
  FaUserFriends,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "@/components/icons";
import StatsCard from "@/components/admin/StatsCard";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto p-4 md:p-6 container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl text-gray-800 font-bold">
            Dashboard Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Orders"
            value="2,458"
            icon={<FaUserFriends size={20} />}
            color="bg-blue-300"
          />
          <StatsCard
            title="Processing"
            value="846"
            icon={<FaUserGraduate size={20} />}
            color="bg-yellow-300"
          />
          <StatsCard
            title="Delivered"
            value="124"
            icon={<FaChalkboardTeacher size={20} />}
            color="bg-green-300"
          />
          <StatsCard
            title="Cancelled"
            value="37"
            icon={<FaUserFriends size={20} />}
            color="bg-red-300"
          />
        </div>
      </main>
    </div>
  );
}
