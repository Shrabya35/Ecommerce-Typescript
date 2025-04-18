"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/redux/slices/categorySlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Modal, Form, Input, Tooltip } from "antd";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const CategoryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, total, totalPages, page, limit, error } =
    useSelector((state: RootState) => state.category);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCategory({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const showModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);

    setTimeout(() => {
      if (category) {
        form.setFieldsValue({ name: category.name });
      } else {
        form.resetFields();
      }
    }, 0);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);

    setTimeout(() => {
      form.resetFields();
    }, 0);
  };

  const handleFinish = async (values: { name: string }) => {
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory._id, ...values }));
      } else {
        await dispatch(addCategory(values));
      }
      handleCancel();
      dispatch(fetchCategory({ page: currentPage, limit: 10 }));
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingCategoryId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deletingCategoryId) {
      await dispatch(deleteCategory({ id: deletingCategoryId }));
      dispatch(fetchCategory({ page: currentPage, limit: 10 }));
      setDeleteModalVisible(false);
      setDeletingCategoryId(null);
    }
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Categories</h1>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer px-4 py-2 rounded flex items-center"
          onClick={() => showModal()}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add Category
        </button>
      </div>

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="e.g. Electronics, Books" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Yes, delete it"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this category?</p>
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
                    Name
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Slug
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-black border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories?.length ? (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-50 border-b"
                    >
                      <td className="py-3 px-4 font-medium text-black">
                        {category.name}
                      </td>
                      <td className="py-3 px-4 font-medium text-black">
                        {category.slug}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-3">
                          <Tooltip title="Edit Category">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => showModal(category)}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete Category">
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDelete(category._id)}
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
                    <td colSpan={3} className="text-center py-8 text-gray-500">
                      No categories found
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
                      {categories?.length ? (currentPage - 1) * limit + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * limit, total)}
                    </span>{" "}
                    of <span className="font-medium">{total}</span> categories
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

export default CategoryTable;
