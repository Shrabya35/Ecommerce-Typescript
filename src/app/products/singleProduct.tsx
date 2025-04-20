"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchSingleProduct } from "@/redux/slices/productSlice";
import ProductCarousel from "@/components/section/productCarousel";
import { Heart, Share2 } from "@/components/icons";
import { toast } from "react-toastify";

interface SingleProductProps {
  slug: string;
}

const SingleProduct: React.FC<SingleProductProps> = ({ slug }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleProduct: productData, loading } = useSelector(
    (state: RootState) => state.product
  ) as {
    singleProduct: {
      category: { name: string } | string | null;
      quantity: number;
      name: string;
      price: number;
      discount?: number;
      discountedPrice?: number;
      description: string;
      _id: string;
    } | null;
    loading: boolean;
  };

  useEffect(() => {
    if (slug) {
      dispatch(fetchSingleProduct({ slug }));
    }
  }, [dispatch, slug]);

  const copyLink = () => {
    const url = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success("URL copied to clipboard!"))
        .catch((err) => {
          toast.error("Failed to copy URL");
          console.error("Could not copy text: ", err);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        const msg = successful
          ? "URL copied to clipboard!"
          : "Failed to copy URL";
        toast.success(msg);
      } catch (err) {
        toast.error("Failed to copy URL");
        console.error("Could not copy text: ", err);
      }

      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-pulse text-lg">Loading product...</div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-lg">No product found.</div>
      </div>
    );
  }

  const stockMessage =
    productData.quantity >= 10
      ? "In Stock"
      : productData.quantity > 0
      ? "Low On Stock"
      : "Out Of Stock";

  const stockMessageColor =
    productData.quantity >= 10
      ? "#28a745"
      : productData.quantity > 0
      ? "#ff9800"
      : "#dc3545";

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 bg-gray-50">
      <div className="bg-white  overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 ">
            <div className="bg-gray-50 rounded-lg w-full h-full flex items-center justify-center p-4">
              <img
                src={`/api/product/photo/${productData._id}`}
                alt={productData.name}
                className="max-h-96 max-w-full object-contain"
              />
            </div>
          </div>

          <div className="md:w-3/5 p-4 sm:p-6 flex flex-col">
            <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  color: stockMessageColor,
                  backgroundColor: `${stockMessageColor}15`,
                }}
              >
                {stockMessage}
              </span>
            </div>

            <h1 className="text-2xl text-gray-800 font-medium mb-2 ">
              {productData.name}
            </h1>

            <div className="mb-4">
              {productData.discount && productData.discount > 0 ? (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    ${productData.discountedPrice}
                  </p>
                  <p className="text-sm text-red-500 line-through">
                    ${productData.price}
                  </p>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    {productData.discount}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  ${productData.price}
                </p>
              )}
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                {productData.description}
              </p>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex mb-2 text-gray-500">
                <span className="text-sm font-medium w-24">Category:</span>
                <span className="text-sm">
                  {typeof productData.category === "object" &&
                  productData.category !== null
                    ? productData.category.name
                    : productData.category || "Fresh Fits"}
                </span>
              </div>

              <div className="flex text-gray-500 mb-6">
                <span className="text-sm font-medium w-24">Availability:</span>
                <span className="text-sm">
                  {productData.quantity} products in stock
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex-none p-3 rounded-full text-gray-600 border border-gray-500 hover:bg-gray-100 cursor-pointer transition duration-200">
                <Heart size={20} />
              </button>

              <button className="flex-grow bg-black text-white font-medium py-3 px-6 rounded-full hover:bg-gray-800 transition duration-200">
                ADD TO BAG
              </button>

              <button
                className="flex-none p-3 rounded-full text-gray-600 border border-gray-500 hover:bg-gray-100 cursor-pointer transition duration-200"
                onClick={copyLink}
                aria-label="Share product"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-8">
        <ProductCarousel
          title="Similar Products"
          queryType="category"
          query={
            typeof productData?.category === "object" &&
            productData?.category !== null
              ? productData.category.name
              : productData?.category || undefined
          }
          similarProduct={productData._id}
        />
      </div>
    </div>
  );
};

export default SingleProduct;
