"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  fetchBag,
  removeFromBag,
  updateBagQuantity,
} from "@/redux/slices/shoppingBagSlice";
import { NoProduct, NoAuth } from "@/assets";
import { ClipLoader, PulseLoader } from "react-spinners";
import { Modal, Tooltip, message } from "antd";
import {
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FaPlus,
  FaMinus,
} from "@/components/icons";
import { formatNumberNPR } from "@/utils/formatNumberNpr";

interface Product {
  _id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number | null;
  category: string | { name: string; _id: string; __v?: number };
  quantity: number;
  image?: {
    data: string;
    contentType: string;
  };
}

interface BagItem {
  product: Product;
  quantity: number;
}

const ShoppingBagPage = () => {
  const router = useRouter();
  const { isAuthenticated, authChecked } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [loadingPage, setLoadingPage] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const {
    bag,
    subtotal,
    estimatedShipping,
    totalPrice,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
  } = useSelector((state: RootState) => state.shoppingBag);

  const fetchRef = useRef<number>(0);
  const isMounted = useRef<boolean>(true);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchId = ++fetchRef.current;

    const fetchData = async () => {
      try {
        await dispatch(fetchBag({ page: currentPage, limit: 10 })).unwrap();
        if (fetchId === fetchRef.current && isMounted.current) {
        }
      } catch (err) {
        if (isMounted.current) {
          console.error("Fetch error:", err);
        }
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        fetchData();
      }
    }, 300);
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated) {
      setRedirecting(true);
      setTimeout(() => {
        if (isMounted.current) {
          router.push("/auth/login");
        }
      }, 1000);
    } else {
      setLoadingPage(false);
    }
  }, [authChecked, isAuthenticated, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setLoadingPage(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const showDeleteModal = (id: string) => {
    setDeletingProductId(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeletingProductId(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      dispatch(removeFromBag({ productId: deletingProductId }))
        .unwrap()
        .then(() => {
          setDeleteModalVisible(false);
          setDeletingProductId(null);

          if (bag.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            dispatch(fetchBag({ page: currentPage, limit: 10 }));
          }
        })
        .catch((error: any) => {
          message.error("Failed to remove item: " + error);
          setDeleteModalVisible(false);
          setDeletingProductId(null);
        });
    }
  };

  const updateQuantity = (productId: string, action: 0 | 1) => {
    if (productId) {
      dispatch(updateBagQuantity({ productId, action }))
        .unwrap()
        .then(() => {
          dispatch(fetchBag({ page: currentPage, limit: 10 }));
        })
        .catch((error: any) => {
          message.error("Failed to update quantity: " + error);
        });
    }
  };

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages && isMounted.current) {
      setCurrentPage(pageNum);
    }
  };

  const handlesecureCheckout = async () => {
    try {
      const res = await axios.post("/api/session/checkout", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = res.data;

      if (res.status === 200 && data.success) {
        router.push("/checkout");
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      message.error(error);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <ClipLoader size={40} color="#E91E63" />
          <p className="mt-4 text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <ClipLoader size={40} color="#E91E63" />
          <PulseLoader color="#000" loading={true} size={10} />
          <p className="mt-4 text-gray-600">Redirecting to ...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader loading={true} size={40} color="#E91E63" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoProduct}
            className="w-40 h-40 object-cover"
            alt="error"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">Error: {error}</h1>
          <p>
            Something went wrong while fetching your bag. Please try again
            later.
          </p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoAuth}
            className="w-40 h-40 object-cover"
            alt="not logged in"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Please log in to view your bag
          </h1>
          <p>Sign in to access your saved products and cart.</p>
        </div>
      );
    }

    if (bag.length === 0) {
      return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoProduct}
            className="w-40 h-40 object-cover"
            alt="empty bag"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Your Bag is empty
          </h1>
          <p>Add products to your bag to see them here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto p-3 sm:p-4">
          <table className="min-w-full border-collapse text-sm">
            <tbody>
              {bag.map((item: BagItem, index) => (
                <tr
                  key={`${item.product._id}-${index}`}
                  className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                >
                  <td
                    className="py-2 px-3"
                    onClick={() => {
                      window.location.href = `/products/${item.product.slug}`;
                    }}
                  >
                    <div className="relative w-10 h-10">
                      <div className="w-10 h-10 overflow-hidden rounded">
                        {item.product && item.product._id ? (
                          <Image
                            src={`/api/product/photo/${item.product._id}`}
                            className="w-full h-full object-cover"
                            alt={`${item.product.name} image`}
                            width={40}
                            height={40}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                            <span className="text-xs text-gray-400">N/A</span>
                          </div>
                        )}
                      </div>
                      {item.quantity > 0 && (
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-pink-500 text-white text-xs font-medium flex items-center justify-center rounded-full">
                          {item.quantity}
                        </div>
                      )}
                    </div>
                  </td>
                  <td
                    className="py-2 px-3"
                    onClick={() => {
                      window.location.href = `/products/${item.product.slug}`;
                    }}
                  >
                    <div className="font-medium text-black">
                      {item.product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.product.type}
                    </div>
                  </td>
                  <td
                    className="py-2 px-3"
                    onClick={() => {
                      window.location.href = `/products/${item.product.slug}`;
                    }}
                  >
                    {item.product.discount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-pink-500 line-through">
                          ₹ {formatNumberNPR(item.product.price)}
                        </span>
                        <span className="text-black font-medium">
                          ₹ {formatNumberNPR(item.product.discountedPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-800">
                        ₹ {formatNumberNPR(item.product.price)}
                      </span>
                    )}
                  </td>
                  <td
                    className="py-2 px-3"
                    onClick={() => {
                      window.location.href = `/products/${item.product.slug}`;
                    }}
                  >
                    <span
                      className={
                        item.product.quantity > 10
                          ? "text-green-500"
                          : item.product.quantity > 0
                          ? "text-amber-500"
                          : "text-red-500"
                      }
                    >
                      {item.product.quantity > 0
                        ? `${item.product.quantity} in stock`
                        : "Out of stock"}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex gap-2">
                      <Tooltip title="Add Quantity">
                        <button
                          className="text-gray-500 cursor-pointer hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.product._id, 1);
                          }}
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Reduce Quantity">
                        <button
                          className="text-gray-600 cursor-pointer hover:text-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.product._id, 0);
                          }}
                        >
                          <FaMinus className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <Tooltip title="Remove From Bag">
                      <button
                        className="text-red-500 cursor-pointer hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          showDeleteModal(item.product._id);
                        }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {total > 0 ? (currentPage - 1) * limit + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * limit, total)}
                  </span>{" "}
                  of <span className="font-medium">{total}</span> products
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={`page-${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? "z-10 bg-pink-500 text-white focus-visible:outline-offset-0"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Modal
        title="Remove From Bag"
        open={deleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteConfirm}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to remove this product from Shopping Bag?</p>
      </Modal>
      <div className={`p-4 ${bag.length > 0 ? "flex-[3]" : "flex-[1]"}`}>
        <div className="flex gap-3 items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Your Shopping Bag</h1>
          <p className="text-sm text-gray-700">{total} products</p>
        </div>
        {renderContent()}
      </div>
      {bag.length > 0 && (
        <div className="flex-[1] md:sticky md:top-0 p-4 fixed bottom-0 w-full md:w-auto bg-white md:bg-transparent">
          <div className="flex flex-col gap-2 p-3 shadow-md bg-gray-50 md:bg-gray-200 rounded-md">
            <h3 className="text-md font-semibold text-black mb-2 pb-1 border-b border-gray-800">
              Order Summary
            </h3>
            <div className="flex items-center justify-between w-full">
              <p>Subtotal ({total} items):</p>
              <p>₹ {formatNumberNPR(subtotal)}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p>Estimated Shipping:</p>
              <p>₹ {formatNumberNPR(estimatedShipping)}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p>Total:</p>
              <p>₹ {formatNumberNPR(totalPrice)}</p>
            </div>
            <button
              className="mt-2 bg-black text-white py-2 cursor-pointer rounded-md hover:bg-gray-600"
              onClick={handlesecureCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingBagPage;
