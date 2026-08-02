import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { getCategories } from "../api/categoryApi";
import { deleteProductById, getProducts, searchProducts } from "../api/productApi";

const SORT_OPTIONS = [
  { value: "newest", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
    page: 1,
    limit: 8,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    totalPages: 1,
    totalProducts: 0,
  });
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      limit: isAdmin ? 10 : 8,
    }));
  }, [isAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        search: searchInput.trim(),
      }));
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.categories || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchProductsApi = filters.search ? searchProducts : getProducts;
        const response = await fetchProductsApi(filters);
        if (!isMounted) return;

        const totalPages = response.totalPages || 1;
        if (filters.page > totalPages && totalPages > 0) {
          setFilters((prev) => ({ ...prev, page: totalPages }));
          return;
        }

        setProducts(response.products || []);
        setPagination({
          page: response.page || 1,
          limit: response.limit || filters.limit,
          totalPages,
          totalProducts: response.totalProducts || 0,
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error("Only admin can delete products");
      return;
    }

    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProductById(id);
      toast.success("Product deleted");
      setFilters((prev) => ({ ...prev }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleCategoryChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      category: value === "all" ? "" : value,
    }));
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      sort: value,
    }));
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) {
      return;
    }
    setFilters((prev) => ({ ...prev, page: nextPage }));
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) {
      return null;
    }

    return (
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
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

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
            <span className="text-sm text-gray-500">
              {pagination.totalProducts} product
              {pagination.totalProducts !== 1 && "s"}
            </span>
          </div>

          {pagination.totalProducts === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No products found.
            </p>
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
          {renderPagination()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Freshly made & delivered
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Discover our best-selling products
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Handpicked snacks, sweets and pickles crafted with authentic taste.
          </p>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 md:grid-cols-3 md:p-5">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />

          <select
            value={filters.category || "all"}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          >
            {SORT_OPTIONS.map((sortOption) => (
              <option key={sortOption.value} value={sortOption.value}>
                {sortOption.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {products.length} of {pagination.totalProducts} products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-lg font-semibold text-gray-700">
              No matching products found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try changing search or filter options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const inStock = Number(product.stock) > 0;
              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image available
                      </div>
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        inStock
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <span className="whitespace-nowrap text-lg font-bold text-amber-700">
                        ₹{product.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.stock} available
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {renderPagination()}
      </div>
    </div>
  );
};

export default List;
