"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useLoading } from "@/context/loadingContext";

import { ClipLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "@/components/icons";

import { login } from "@/redux/slices/authSlice";

const LoginForm = () => {
  const { setLoading } = useLoading();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { loading } = useSelector((state: RootState) => state.auth);

  const router = useRouter();

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        login({ credentials: { email, password, rememberMe } })
      ).unwrap();

      if (result && !("error" in result)) {
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-base font-medium focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-base font-medium focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 hover:cursor-pointer" />
              ) : (
                <FaEye className="h-5 w-5 hover:cursor-pointer" />
              )}
            </button>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-black hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-200 flex justify-center items-center"
          >
            {loading ? (
              <div className="flex items-center">
                <ClipLoader color="#ffffff" loading={true} size={24} />
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-black hover:underline"
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
