import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.product || response.data;

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price ?? 0);
        setStock(product.stock ?? 0);
        setCategoryId(product.category_id ?? product.category_id ?? "");
        setImage(product.image_url || product.image || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category_id: Number(categoryId),
        image_url: image,
      };

      const response = await api.put(`/products/${id}`, payload);

      if (response.data.success) {
        toast.success(response.data.message || "Product updated successfully");
      } else {
        toast.success(response.data.message || "Product updated");
      }

      navigate("/list");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading product...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select Category</option>
              <option value="1">Pickles</option>
              <option value="2">Sweets</option>
              <option value="3">Snacks</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium text-gray-700">
              Image Name
            </label>
            <input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              type="text"
              placeholder="Example: chicken.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 active:scale-[0.98]">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
