"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/redux/slices/productSlice";
import { fetchCategory } from "@/redux/slices/categorySlice";
import Image from "next/image";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Tooltip,
} from "antd";
import { toast } from "react-toastify";
import { formatNumberNPR } from "@/utils/formatNumberNpr";

import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UploadIcon,
} from "@/components/icons";

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

interface Category {
  _id: string;
  name: string;
}

const ProductsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, total, totalPages, page, limit } = useSelector(
    (state: RootState) => state.product
  );
  const { categories } = useSelector((state: RootState) => state.category);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form] = Form.useForm();

  const productTypes = ["Men", "Women", "Accessories"];

  useEffect(() => {
    dispatch(fetchProduct({ page: currentPage, limit: 10 }));
    dispatch(fetchCategory({}));
  }, [dispatch, currentPage]);

  const showModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    setImagePreview(null);
    setImageFile(null);

    setTimeout(() => {
      if (product) {
        form.setFieldsValue({
          name: product.name,
          type: product.type,
          description: product.description,
          price: product.price,
          discount: product.discount || 0,
          category:
            typeof product.category === "string"
              ? product.category
              : product.category._id,
          quantity: product.quantity,
        });
      } else {
        form.resetFields();
      }
    }, 0);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    setImagePreview(null);
    setImageFile(null);
    form.resetFields();
  };

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
      dispatch(deleteProduct({ id: deletingProductId }))
        .unwrap()
        .then(() => {
          setDeleteModalVisible(false);
          setDeletingProductId(null);
        })
        .catch(() => {
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

  const getCategoryName = (
    category: string | { name: string; _id: string; __v?: number }
  ): string => {
    if (typeof category === "string") {
      return category;
    }
    return category?.name || "Uncategorized";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1_000_000) {
        toast.error("Image size should be smaller than 1MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: any) => {
    if (!editingProduct && !imageFile) {
      message.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("category", values.category);
    formData.append("quantity", values.quantity.toString());

    if (values.discount) {
      formData.append("discount", values.discount.toString());
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct._id, formData }))
        .unwrap()
        .then(() => {
          handleCancel();
        })
        .catch(() => {});
    } else {
      dispatch(addProduct(formData))
        .unwrap()
        .then(() => {
          handleCancel();
        })
        .catch(() => {});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Products</h1>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer px-4 py-2 rounded flex items-center"
          onClick={() => showModal()}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add Product
        </button>
      </div>

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        width={700}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            type: "Men",
            discount: 0,
            quantity: 1,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input placeholder="e.g Tshirt Pant " />
            </Form.Item>

            <Form.Item
              name="type"
              label="Product Type"
              rules={[
                { required: true, message: "Please select product type" },
              ]}
            >
              <Select placeholder="Select product type">
                {productTypes.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Price (₹)"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item name="discount" label="Discount (%)">
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="0"
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                {categories &&
                  categories.map((category: Category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Stock Quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} placeholder="Describe your product..." />
          </Form.Item>

          <Form.Item
            label="Product Image"
            rules={[
              { required: !editingProduct, message: "Please upload an image" },
            ]}
          >
            <div className="flex items-center space-x-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                <input
                  type="file"
                  id="productImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="productImage"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer flex items-center"
                >
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Upload Image
                </label>
                <p className="text-xs text-gray-500 mt-2">Max size: 1MB</p>
              </div>

              {imagePreview ? (
                <div className="w-24 h-24 overflow-hidden rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : editingProduct ? (
                <div className="w-24 h-24 overflow-hidden rounded-lg">
                  <Image
                    src={`/api/product/photo/${editingProduct._id}`}
                    alt={editingProduct.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete Product"
        open={deleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteConfirm}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
      </Modal>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      ) : (
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
                    Category
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
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product: Product) => (
                    <tr key={product._id} className="hover:bg-gray-50 border-b">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 overflow-hidden rounded">
                          {product ? (
                            <Image
                              src={`/api/product/photo/${product._id}`}
                              className="w-full h-full object-cover"
                              alt={product.name}
                              width={500}
                              height={300}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-black">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.type}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {getCategoryName(product.category)}
                      </td>
                      <td className="py-3 px-4">
                        {product.discount > 0 ? (
                          <div>
                            <span className="text-pink-500 font-medium">
                              ₹{formatNumberNPR(product.discountedPrice)}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ₹ {formatNumberNPR(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-black">
                            ₹ {formatNumberNPR(product.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`${
                            product.quantity > 10
                              ? "text-green-600"
                              : product.quantity > 0
                              ? "text-orange-500"
                              : "text-red-500"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-3">
                          <Tooltip title="Edit Product">
                            <button
                              onClick={() => showModal(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete Category">
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => showDeleteModal(product._id)}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
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
                      {products?.length ? (currentPage - 1) * limit + 1 : 0}
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
                          key={pageNum}
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
      )}
    </div>
  );
};

export default ProductsTable;
