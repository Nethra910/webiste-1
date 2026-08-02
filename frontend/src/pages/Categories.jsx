import React, { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getCategories();
        setCategories(response.categories || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="rounded-md bg-red-100 px-4 py-2 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-4">
      <h1 className="mb-5 text-2xl font-bold text-gray-900">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-lg font-semibold text-gray-900">{category.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
