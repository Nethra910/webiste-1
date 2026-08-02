import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCategories } from "../api/categoryApi";
import { createProduct } from "../api/productApi";

const Add = () => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.categories || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category_id: Number(categoryId),
        image_url: image,
      };

      const response = await createProduct(productData);
      if (response.success) {
        toast.success(response.message || "Product added successfully");
      } else {
        toast.error(response.message || "Failed to add product");
      }

      // clear form after success
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setImage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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
