const { body } = require("express-validator");

const validateAddress = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full name must be between 3 and 100 characters."),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain exactly 10 digits."),

  body("address_line1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required.")
    .isLength({ max: 255 })
    .withMessage("Address Line 1 cannot exceed 255 characters."),

  body("address_line2")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Address Line 2 cannot exceed 255 characters."),

  body("city").trim().notEmpty().withMessage("City is required."),

  body("state").trim().notEmpty().withMessage("State is required."),

  body("postal_code")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required.")
    .matches(/^[0-9]{6}$/)
    .withMessage("Postal code must contain exactly 6 digits."),

  body("country")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country name is too long."),

  body("address_type")
    .optional()
    .isIn(["Home", "Work", "Other"])
    .withMessage("Address type must be Home, Work or Other."),
];

module.exports = {
  validateAddress,
};
