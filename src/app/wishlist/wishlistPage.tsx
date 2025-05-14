"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import {
  fetchBag,
  addToBag,
  updateBagQuantity,
} from "@/redux/slices/shoppingBagSlice";
import Image from "next/image";
import { AppDispatch, RootState } from "@/redux/store";
import { Modal, Tooltip, message } from "antd";
import {
  TrashIcon,
  FaShoppingBag,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { NoWishlist } from "@/assets";
import { toast } from "react-toastify";

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

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlist, loading, total, totalPages, page, limit } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { bag = [] } = useSelector(
    (state: RootState) => state.shoppingBag || { bag: [] }
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchWishlist({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const showDeleteModal = (id: string) => {
    setDeletingProductId(id);
    setDeleteModalVisible(true);
  };

  const toggleBag = (productData: Product) => {
    const isInBag = Boolean(
      productData &&
        productData._id &&
        bag &&
        Array.isArray(bag) &&
        bag.some((item: any) => item && item.product._id === productData._id)
    );

    if (!productData || !productData._id) {
      toast.error("Product information is not available");
      return;
    }
    if (isInBag) {
      dispatch(updateBagQuantity({ productId: productData._id, action: 1 }))
        .unwrap()
        .then(() => {
          dispatch(fetchBag({ page: 1, limit: 100 }));
        })
        .catch((error) => {});
    } else {
      dispatch(addToBag({ productId: productData._id }))
        .unwrap()
        .then(() => {
          dispatch(fetchBag({ page: 1, limit: 100 }));
        })
        .catch((error) => {});
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeletingProductId(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      dispatch(removeFromWishlist({ productId: deletingProductId }))
        .unwrap()
        .then(() => {
          setDeleteModalVisible(false);
          setDeletingProductId(null);

          if (wishlist?.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            dispatch(fetchWishlist({ page: currentPage, limit: 10 }));
          }
        })
        .catch((error) => {
          message.error("Failed to remove item: " + error);
          setDeleteModalVisible(false);
          setDeletingProductId(null);
        });
    }
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderWishlistItems = () => {
    if (!wishlist || wishlist.length === 0) {
      return null;
    }

    return wishlist.map((product: Product, index: number) => (
      <tr
        key={`${product._id}-${index}`}
        className="hover:bg-gray-50 border-b cursor-pointer"
      >
        <td
          className="py-3 px-4"
          onClick={() => {
            window.location.href = `/products/${product.slug}`;
          }}
        >
          <div className="w-12 h-12 overflow-hidden rounded">
            {product && product._id ? (
              <Image
                src={`/api/product/photo/${product._id}`}
                className="w-full h-full object-cover"
                alt={`Image of ${product.name}`}
                width={500}
                height={300}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-400">No image</span>
              </div>
            )}
          </div>
        </td>
        <td
          className="py-3 px-4"
          onClick={() => {
            window.location.href = `/products/${product.slug}`;
          }}
        >
          <div className="font-medium text-black">{product.name}</div>
          <div className="text-sm text-gray-500">{product.type}</div>
        </td>
        <td
          className="py-3 px-4"
          onClick={() => {
            window.location.href = `/products/${product.slug}`;
          }}
        >
          {product.discount > 0 ? (
            <div>
              <span className="text-pink-500 font-medium">
                ${product.discountedPrice}
              </span>
              <span className="text-sm text-gray-400 line-through ml-2">
                ${product.price}
              </span>
            </div>
          ) : (
            <span className="text-black">${product.price}</span>
          )}
        </td>
        <td
          className="py-3 px-4"
          onClick={() => {
            window.location.href = `/products/${product.slug}`;
          }}
        >
          <span
            className={`${
              product.quantity > 10
                ? "text-green-600"
                : product.quantity > 0
                ? "text-orange-500"
                : "text-red-500"
            }`}
          >
            {product.quantity > 0
              ? `${product.quantity} in stock`
              : "Out of stock"}
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="flex space-x-3">
            <Tooltip title="Remove From Wishlist">
              <button
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  showDeleteModal(product._id);
                }}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </Tooltip>
            <Tooltip title="Add to Bag">
              <button
                className="text-black hover:text-gray-700 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBag(product);
                }}
              >
                <FaShoppingBag className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex gap-3 items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Your Wishlist</h1>
        <p className="text-sm text-gray-700">{total} products</p>
      </div>

      <Modal
        title="Remove From Wishlist"
        open={deleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteConfirm}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to remove this product from wishlist?</p>
      </Modal>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : wishlist && wishlist.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Image
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Stock
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>{renderWishlistItems()}</tbody>
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
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] text-center">
          <Image
            src={NoWishlist}
            className="w-40 h-40 object-cover"
            alt="no wishlist"
            width={500}
            height={300}
            loading="lazy"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Your wishlist is empty
          </h1>
          <p>
            Tap the heart next to anything you like the look of and we'll save
            it here.
          </p>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
