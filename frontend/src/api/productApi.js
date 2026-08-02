import api from "./api";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const searchProducts = async (params = {}) => {
  const response = await api.get("/products/search", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await api.post("/products", payload);
  return response.data;
};

export const updateProductById = async (id, payload) => {
  const response = await api.put(`/products/${id}`, payload);
  return response.data;
};

export const deleteProductById = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
