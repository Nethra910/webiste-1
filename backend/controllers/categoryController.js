const Category = require("../models/categoryModel");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAllActiveCategories();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategories,
};
