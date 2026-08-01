import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/products");
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="rounded-md bg-red-100 px-4 py-2 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
          <span className="text-sm text-gray-500">
            {products.length} product{products.length !== 1 && "s"}
          </span>
        </div>

        {products.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {product.name}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      ₹{product.price}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          product.stock > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="max-w-xs truncate px-4 py-3 text-gray-500">
                      {product.description}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/edit/${product.id}`}
                          className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-yellow-600 active:scale-95"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
