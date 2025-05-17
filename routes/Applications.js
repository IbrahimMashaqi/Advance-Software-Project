const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
} = require("../controllers/applications.controller.js");

router.use(express.json());

router.post("/", authenticateToken, createApplication);
router.get("/", authenticateToken, getAllApplications);
router.get("/:id", authenticateToken, getApplicationById);
router.put("/:id", authenticateToken, updateApplicationById);
router.delete("/:id", authenticateToken, deleteApplicationById);

module.exports = router;
