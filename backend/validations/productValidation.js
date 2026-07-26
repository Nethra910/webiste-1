const { body } = require("express-validator");

const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),

  body("stock").isInt({ min: 0 }).withMessage("Stock cannot be negative"),

  body("category_id").isInt({ min: 1 }).withMessage("Invalid category"),

  body("image_url").optional().isString(),
];

module.exports = productValidation;
