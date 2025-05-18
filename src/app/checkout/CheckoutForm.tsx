"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createCashOrder, createEsewaOrder } from "@/redux/slices/orderSlice";
import { toast } from "react-toastify";
import { Esewa, CashOnDelivery } from "@/assets";

const CheckoutForm = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [form, setForm] = useState<{
    country: string;
    street: string;
    secondary: string;
    city: string;
    postalCode: string;
    mode: 0 | 1;
  }>({
    country: "",
    street: "",
    secondary: "",
    city: "",
    postalCode: "",
    mode: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!form.country || !form.street || !form.city || !form.postalCode) {
      toast.error("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    if (form.postalCode.length < 5) {
      toast.error("Postal code must be at least 5 characters");
      setSubmitting(false);
      return;
    }

    try {
      if (form.mode === 0) {
        await dispatch(
          createCashOrder({
            address: {
              country: form.country,
              street: form.street,
              secondary: form.secondary,
              city: form.city,
              postalCode: form.postalCode,
            },
            mode: form.mode,
          })
        ).unwrap();
        router.push("/checkout/success");
      } else {
        const result = await dispatch(
          createEsewaOrder({
            address: {
              country: form.country,
              street: form.street,
              secondary: form.secondary,
              city: form.city,
              postalCode: form.postalCode,
            },
            mode: form.mode,
          })
        ).unwrap();
        if (result.redirect) {
          window.location.href = result.redirect;
        } else {
          throw new Error("No redirect URL provided for eSewa payment");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
      console.error("Checkout error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex justify-center p-4">
        <p className="text-red-500">Please log in to checkout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <h2 className="text-xl font-bold text-black">Delivery Contact</h2>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            placeholder="Email *"
            value={user.email || ""}
            disabled
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-black bg-gray-100 cursor-not-allowed"
            aria-disabled="true"
          />
        </div>

        <h3 className="text-lg font-semibold text-black">
          Shipping Information
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="country" className="sr-only">
              Country
            </label>
            <input
              id="country"
              placeholder="Country *"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-safe focus:border-black"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="street" className="sr-only">
              Street Address
            </label>
            <input
              id="street"
              placeholder="Street Address *"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              required
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-safe focus:border-black"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="secondary" className="sr-only">
              Apartment, Suite, etc.
            </label>
            <input
              id="secondary"
              placeholder="Apartment, Suite, etc. (optional)"
              value={form.secondary}
              onChange={(e) => setForm({ ...form, secondary: e.target.value })}
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-safe focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="city" className="sr-only">
              City
            </label>
            <input
              id="city"
              placeholder="City *"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-safe focus:border-black"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="sr-only">
              Postal Code
            </label>
            <input
              id="postalCode"
              placeholder="Postal Code *"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              required
              disabled={submitting}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-safe focus:border-black"
              aria-required="true"
            />
          </div>
          <div className="flex flex-row space-x-4">
            <label
              className="flex-1 flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 text-black focus-within:border-black cursor-pointer"
              aria-label="Cash on Delivery"
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="0"
                  checked={form.mode === 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mode: parseInt(e.target.value) as 0 | 1,
                    })
                  }
                  disabled={submitting}
                  className="mr-2"
                  aria-checked={form.mode === 0}
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
            <label
              className="flex-1 flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 text-black focus-within:border-black cursor-pointer"
              aria-label="eSewa"
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="1"
                  checked={form.mode === 1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mode: parseInt(e.target.value) as 0 | 1,
                    })
                  }
                  disabled={submitting}
                  className="mr-2"
                  aria-checked={form.mode === 1}
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
            disabled={submitting}
            className={`w-full py-3 rounded-md font-semibold transition ${
              submitting
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            aria-disabled={submitting}
          >
            {submitting ? "Processing..." : "Continue"}
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
