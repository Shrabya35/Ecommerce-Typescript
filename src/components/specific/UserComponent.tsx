import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "@/redux/slices/userOrderSlice";
import { updateUserAddress } from "@/redux/slices/authSlice";
import { formatDate } from "@/utils/formatDate";
import { formatNumberNPR } from "@/utils/formatNumberNpr";
import { greetings } from "@/constants";
import { User, Package } from "@/components/icons";

export const ProfileTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  }, []);

  const { user } = useSelector((state: RootState) => state.auth);
  const { userOrders, loading, error, page, total, totalPages, statusSummary } =
    useSelector((state: RootState) => state.userOrder);

  const stats = [
    {
      label: "Total Orders",
      value: total,
      icon: <Package size={18} />,
    },
    {
      label: "Processing",
      value: statusSummary.processing,
      icon: <Package size={18} />,
    },
    {
      label: "Completed",
      value: statusSummary.completed,
      icon: <Package size={18} />,
    },
    {
      label: "Cancelled",
      value: statusSummary.cancelled,
      icon: <Package size={18} />,
    },
  ];

  const handleLoadMore = () => {
    if (page < totalPages) {
      dispatch(fetchUserOrders({ page: page + 1, limit: 6 }));
    }
  };

  return (
    <div>
      <div className="bg-black text-white rounded-lg p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-100 opacity-10 rounded-full -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <span className="text-xs uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
            {greeting}
          </span>
          <h2 className="text-2xl font-bold mt-4 mb-2">
            Welcome back, {user?.name.split(" ")[0]}
          </h2>
          <p className="text-white/80">
            Track your orders, manage your profile, and discover your next
            favorite gear.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Your Orders</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-lg p-4 flex items-center"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && userOrders.length === 0 && (
        <div className="text-center text-gray-500">Loading orders...</div>
      )}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      {!loading && userOrders.length === 0 && !error && (
        <div className="text-center text-gray-500">No orders found</div>
      )}

      {!loading && userOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="font-medium">#{order._id?.slice(-6)}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(order.createdAt.toString())}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        order.status === "completed"
                          ? "bg-green-300"
                          : order.status === "processing"
                          ? "bg-yellow-300"
                          : "bg-red-300"
                      }`}
                    ></span>
                    <span className="text-sm">{order.status}</span>
                  </div>
                </div>
                <div className="flex justify-between md:flex-col md:text-right mt-4 md:mt-0">
                  <div className="font-medium">
                    ₹ {formatNumberNPR(order.price)}
                  </div>
                  <button className="text-sm text-pink-500 hover:text-pink-400 cursor-pointer mt-1">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {page < totalPages && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 p-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Profile Summary</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <User size={18} className="mr-3 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-sm text-gray-500">
                {user?.createdAt
                  ? formatDate(user.createdAt.toString())
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddressTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    country: user?.tempAddress.country,
    city: user?.tempAddress.city,
    street: user?.tempAddress.street,
    secondary: user?.tempAddress.secondary,
    postalCode: user?.tempAddress.postalCode,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateAddress = async () => {
    if (
      !user?.tempAddress ||
      formData.country !== (user.tempAddress.country || "") ||
      formData.city !== (user.tempAddress.city || "") ||
      formData.street !== (user.tempAddress.street || "") ||
      formData.secondary !== (user.tempAddress.secondary || "") ||
      formData.postalCode !== (user.tempAddress.postalCode || "")
    ) {
      try {
        await dispatch(
          updateUserAddress({
            address: {
              country: formData.country || "",
              city: formData.city || "",
              street: formData.street || "",
              secondary: formData.secondary || "",
              postalCode: formData.postalCode || "",
            },
          })
        ).unwrap();
      } catch (error) {
        console.error("Update address failed:", error);
      }
    } else {
      console.log("No changes to update");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h2 className="text-xl font-medium mb-6">Delivery Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Country</label>
          <input
            type="text"
            name="country"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">City</label>
          <input
            type="text"
            name="city"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Street</label>
          <input
            type="text"
            name="street"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.street}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Secondary</label>
          <input
            type="text"
            name="secondary"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.secondary}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Postal</label>
          <input
            type="text"
            name="postalCode"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.postalCode}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-600 transition disabled:bg-gray-500 cursor-pointer"
          onClick={handleUpdateAddress}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Address"}
        </button>
      </div>
    </div>
  );
};

export const SettingsTab = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h2 className="text-xl font-medium mb-6">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mt-8">
        <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition">
          Update Profile
        </button>
      </div>
    </div>
  );
};
