const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const validateRequest = require("../middleware/validateRequest");
const productValidation = require("../validations/productValidation");

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  productValidation,
  validateRequest,
  addProduct,
);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  productValidation,
  validateRequest,
  updateProduct,
);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteProduct);

module.exports = router;
