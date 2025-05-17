const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const {
  addDonationHandler,
  getAllDonationsHandler,
  getDonationByIdHandler,
  updateDonationHandler,
  deleteDonationHandler,
} = require("../controllers/donation.controller");

const router = express.Router();
router.use(express.json());

router.post("/", authenticateToken, addDonationHandler);
router.get("/", authenticateToken, getAllDonationsHandler);
router.get("/:id", authenticateToken, getDonationByIdHandler);
router.put("/:id", authenticateToken, updateDonationHandler);
router.delete("/:id", authenticateToken, deleteDonationHandler);

module.exports = router;
