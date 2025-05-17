const express = require("express");
const router = express.Router();
const {
  getAllEmergenciesHandler,
  createEmergencyHandler,
  getEmergencyByIdHandler,
  updateEmergencyHandler,
  deleteEmergencyHandler,
} = require("../controllers/emergency.controller");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", getAllEmergenciesHandler);
router.get("/:id", getEmergencyByIdHandler);
router.post("/", authenticateToken, createEmergencyHandler);
router.put("/:id", authenticateToken, updateEmergencyHandler);
router.delete("/:id", authenticateToken, deleteEmergencyHandler);

module.exports = router;
