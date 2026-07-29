const { body } = require("express-validator");

exports.validateOrderStatus = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Order status is required.")
    .isIn([
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ])
    .withMessage("Invalid order status."),
];

module.exports = exports;
