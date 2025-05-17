const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const {
  getAllSponsorshipsHandler,
  addSponsorshipHandler,
  getSponsorshipByIdHandler,
  updateSponsorshipHandler,
  deleteSponsorshipHandler,
} = require("../controllers/sponsorship_controller");

const router = express.Router();
router.use(express.json());

router.post("/", authenticateToken, addSponsorshipHandler);
router.get("/", authenticateToken, getAllSponsorshipsHandler);
router.get("/:id", authenticateToken, getSponsorshipByIdHandler);
router.put("/:id", authenticateToken, updateSponsorshipHandler);
router.delete("/:id", authenticateToken, deleteSponsorshipHandler);

module.exports = router;
