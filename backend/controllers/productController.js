const Product = require("../models/productModel");
const ApiError = require("../utils/ApiError");

const addProduct = async (req, res, next) => {
  try {
    await Product.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search || "",
      category: req.query.category || "",
      sort: req.query.sort || "newest",
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };

    const products = await Product.getAllProducts(filters);
    const totalProducts = await Product.getProductCount(filters);
    const totalPages = Math.ceil(totalProducts / filters.limit);

    return res.status(200).json({
      success: true,
      page: filters.page,
      limit: filters.limit,
      totalProducts,
      totalPages,
      products,
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.getProductById(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError(400, "Invalid product ID");
    }

    const existingProduct = await Product.getProductById(id);

    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    await Product.updateProduct(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiError(400, "Invalid product ID");
    }

    const existingProduct = await Product.getProductById(id);

    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    await Product.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
