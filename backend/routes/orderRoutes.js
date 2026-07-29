const router = require("express").Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware").verifyToken;

router.use(verifyToken);

router.post("/", orderController.placeOrder);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);

module.exports = router;
