"use client";

import { useEffect, useState } from "react";

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    setTimeout(() => {
      setSpin(true);
    }, 2000);

    return () => {};
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white overflow-hidden relative">
      <div className="text-center p-10 max-w-xl z-10 relative">
        <div
          className={`relative transition-transform duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-9xl font-extrabold tracking-tighter text-black relative">
            <span className="inline-block">4</span>
            <span
              className={`inline-block transition-transform duration-700 ${
                isLoaded ? "scale-100" : "scale-0"
              } delay-100`}
            >
              0
            </span>
            <span className="inline-block">4</span>

            <div
              className={`absolute -top-6 -right-6 transition-transform duration-1000 ${
                spin ? "animate-spin-slow" : ""
              }`}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM30 50C19 50 10 41 10 30C10 19 19 10 30 10C41 10 50 19 50 30C50 41 41 50 30 50Z"
                  fill="#ec4899"
                />
                <path
                  d="M31 18C31 19.1 30.1 20 29 20C27.9 20 27 19.1 27 18C27 16.9 27.9 16 29 16C30.1 16 31 16.9 31 18Z"
                  fill="#ec4899"
                />
                <path
                  d="M31 42C31 43.1 30.1 44 29 44C27.9 44 27 43.1 27 42C27 40.9 27.9 40 29 40C30.1 40 31 40.9 31 42Z"
                  fill="#ec4899"
                />
                <path
                  d="M42 31C43.1 31 44 30.1 44 29C44 27.9 43.1 27 42 27C40.9 27 40 27.9 40 29C40 30.1 40.9 31 42 31Z"
                  fill="#ec4899"
                />
                <path
                  d="M18 31C19.1 31 20 30.1 20 29C20 27.9 19.1 27 18 27C16.9 27 16 27.9 16 29C16 30.1 16.9 31 18 31Z"
                  fill="#ec4899"
                />
              </svg>
            </div>
          </h1>
        </div>

        <div
          className={`transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl mt-6 text-black font-bold">
            Whoops! Page Not Found
          </h2>
          <p className="mt-4 text-lg text-gray-800">
            Looks like this page ran off with your attention, just like your ex
            did.
          </p>
          <p className="mt-2 text-lg text-gray-800 italic">
            Don't worry, this page doesn't have commitment issues, but we might.
          </p>
        </div>

        <div className="mt-8 flex justify-center space-x-8">
          {["Your broken heart", "Their new place", "Your memories"].map(
            (text, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${500 + index * 200}ms` }}
              >
                <div className="w-16 h-16 mx-auto">
                  {index === 0 && (
                    <svg
                      className="animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 12.5719L12 19.9999L4.5 12.5719C2.5 10.5719 2.5 7.07185 4.5 5.07185C6.5 3.07185 10 3.07185 12 5.07185C14 3.07185 17.5 3.07185 19.5 5.07185C21.5 7.07185 21.5 10.5719 19.5 12.5719Z"
                        stroke="#ec4899"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg
                      className="animate-float"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                        stroke="#ec4899"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg
                      className="animate-wiggle"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
                        fill="#ec4899"
                      />
                    </svg>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-700">{text}</p>
              </div>
            )
          )}
        </div>

        <div
          className={`mt-10 transition-all duration-1000 delay-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <a
            href="/"
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition duration-300 inline-flex items-center group hover:shadow-lg transform hover:-translate-y-1"
          >
            <span>Go back home</span>
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-200 transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <p
          className={`mt-12 text-sm text-gray-500 transition-opacity duration-1000 delay-1200 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          Maybe we can still be friends... just refresh the page.
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
