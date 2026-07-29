const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware").verifyToken;
const authorizeRoles = require("../middleware/authorizeRoles");
const orderController = require("../controllers/orderController");
const validateOrderStatus =
  require("../validations/orderValidation").validateOrderStatus;
const validateRequest = require("../middleware/validateRequest");

router.use(verifyToken);

router.get("/", authorizeRoles("admin"), orderController.getAllOrders);

// Get order details
router.get("/:id", authorizeRoles("admin"), orderController.getAdminOrderById);

// Update order status
router.patch(
  "/:id/status",
  authorizeRoles("admin"),
  validateOrderStatus,
  validateRequest,
  orderController.updateOrderStatus,
);

module.exports = router;
