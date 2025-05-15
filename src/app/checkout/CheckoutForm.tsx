"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Esewa, CashOnDelivery } from "@/assets";

const CheckoutForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    country: "",
    street: "",
    secondary: "",
    city: "",
    postalCode: "",
    mode: 0,
  });

  const { user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <h2 className="text-xl font-bold text-black">Delivery Contact</h2>

        <div>
          <input
            placeholder="Email *"
            value={user?.email || ""}
            disabled
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-black bg-gray-100 cursor-not-allowed"
          />
        </div>

        <h3 className="text-lg font-semibold text-black">
          Shipping Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              placeholder="Country *"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <input
              placeholder="Street Address *"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <input
              placeholder="Apartment, Suite, etc. (optional)"
              value={form.secondary}
              onChange={(e) => setForm({ ...form, secondary: e.target.value })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <input
              placeholder="City *"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <input
              placeholder="Postal Code *"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex flex-row space-x-4">
            <label className="flex-1 flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 text-black focus-within:border-black cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="0"
                  checked={form.mode === 0}
                  onChange={(e) =>
                    setForm({ ...form, mode: parseInt(e.target.value) })
                  }
                  className="mr-2"
                />
                <span>Cash on Delivery</span>
              </div>
              <Image
                src={CashOnDelivery}
                alt="Cash on Delivery"
                width={40}
                height={20}
                className="object-contain"
              />
            </label>
            <label className="flex-1 flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 text-black focus-within:border-black cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="1"
                  checked={form.mode === 1}
                  onChange={(e) =>
                    setForm({ ...form, mode: parseInt(e.target.value) })
                  }
                  className="mr-2"
                />
                <span>eSewa</span>
              </div>
              <Image
                src={Esewa}
                alt="eSewa"
                width={40}
                height={20}
                className="object-contain"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Continue
          </button>
        </form>

        <p className="text-sm text-gray-600">
          By placing your order you agree to LynxLine's{" "}
          <Link
            href="/article/privacy-policy"
            className="underline text-black hover:text-gray-800"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/article/return-policy"
            className="underline text-black hover:text-gray-800"
          >
            Return Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;
