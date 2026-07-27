const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyToken = require("../middleware/authMiddleware").verifyToken;

router.use(verifyToken);

router.post("/", cartController.addToCart);
router.get("/", cartController.getCart);
router.put("/:productId", cartController.updateQuantity);
router.delete("/:productId", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

module.exports = router;
