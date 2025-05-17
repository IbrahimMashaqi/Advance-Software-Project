const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {
  createVolunteer,
  getVolunteers,
  getVolunteerById,
  updateVolunteerProfile,
  deleteVolunteerProfile,
} = require("../controllers/volunteer.controller");

router.use(express.json());

router.post("/", authenticateToken, createVolunteer);
router.get("/", authenticateToken, getVolunteers);
router.get("/:id", authenticateToken, getVolunteerById);
router.put("/:id", authenticateToken, updateVolunteerProfile);
router.delete("/:id", authenticateToken, deleteVolunteerProfile);

module.exports = router;
