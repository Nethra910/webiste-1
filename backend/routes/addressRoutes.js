const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const verifyToken = require("../middleware/authMiddleware").verifyToken;
const { validateAddress } = require("../validations/addressValidator");
const validateRequest = require("../middleware/validateRequest");

router.use(verifyToken);

router.post(
  "/",
  validateAddress,
  validateRequest,
  addressController.addAddress,
);

router.get("/", addressController.getAddresses);
router.get("/:id", addressController.getAddressById);
router.put(
  "/:id",
  validateAddress,
  validateRequest,
  addressController.updateAddress,
);

router.delete("/:id", addressController.deleteAddress);
router.put("/:id/default", addressController.setDefaultAddress);

module.exports = router;
