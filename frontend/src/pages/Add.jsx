import React, { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const Add = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price,
        stock,
        category_id: categoryId,
        image_url: image,
      };

      const response = await api.post("/products/", productData);
      if (response.data.success) {
        toast.success(response.data.message || "Product added successfully");
      } else {
        toast.error(response.data.message || "Failed to add product");
      }

      // clear form after success
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setImage("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>

            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              id="name"
              placeholder="Enter product name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              id="description"
              placeholder="Enter product description"
              rows="4"
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price
              </label>

              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                id="price"
                placeholder="Enter price"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Stock
              </label>

              <input
                onChange={(e) => setStock(e.target.value)}
                value={stock}
                type="number"
                id="stock"
                placeholder="Enter stock"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <select
              onChange={(e) => setCategoryId(e.target.value)}
              value={categoryId}
              id="category"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select Category</option>
              <option value="1">Pickles</option>
              <option value="2">Sweets</option>
              <option value="3">Snacks</option>
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Image Name
            </label>

            <input
              onChange={(e) => setImage(e.target.value)}
              value={image}
              type="text"
              id="image"
              placeholder="Example: chicken.jpg"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 active:scale-[0.98]"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
