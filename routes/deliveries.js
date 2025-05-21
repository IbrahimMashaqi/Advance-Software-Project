const express = require("express");
const {
  getDeliveries, getDeliveryById,
  addDelivery, upDelivery,
  delDelivery
} = require("../controllers/deliveries.controller");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();
router.use(express.json());

router.get("/", authenticateToken, getDeliveries);
router.get("/:id", authenticateToken, getDeliveryById);
router.post("/", authenticateToken, addDelivery);
router.put("/:id", authenticateToken, upDelivery);
router.delete("/:id", authenticateToken, delDelivery);


module.exports = router;