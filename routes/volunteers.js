const express = require("express");
const { authenticateToken } = require("./users");
const {
  addVolunteer,
  isVolunteer,
  getAllVolunteers,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
} = require("../database_managment/volunteers_db");
const router = express.Router();
router.use(express.json());
const jwt = require("jsonwebtoken");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (decoded.role !== "volunteer" && decoded.role !== "admin") {
      res
        .status(403)
        .json({
          message: "Only volunteers or admins can create volunteer profiles.",
        });
    }

    const { user_id, skills, availability } = req.body;

    const flag = await isVolunteer(user_id);
    if (!flag) {
      res.status(400).json({ message: "User is not a volunteer", data: "" });
    }

    if (decoded.role === "volunteer" && decoded.id !== user_id) {
      res
        .status(403)
        .json({ message: "Volunteers can only create their own profile." });
    }

    const result = await addVolunteer(user_id, skills, availability);

    res
      .status(201)
      .json({
        message: "Volunteer profile created successfully.",
        data: result,
      });
  } catch (err) {
    console.error("Error inserting volunteer:", err);
    res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (decoded.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied", data: "" });
    }

    const volunteers = await getAllVolunteers();

    if (volunteers.length === 0) {
      return res.status(200).json({ message: "No volunteers found", data: [] });
    }

    res.status(200).json({ message: "Volunteers retrieved", data: volunteers });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (decoded.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied", data: "" });
    }
    const id = req.params.id;
    const volunteers = await getVolunteer(id);

    if (volunteers.length === 0) {
      return res.status(200).json({ message: "No volunteers found", data: [] });
    }

    res.status(200).json({ message: "Volunteer retrieved", data: volunteers });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    const volunteerId = req.params.id;
    const { skills, availability } = req.body;

    if (decoded.role.toLowerCase() !== "admin" && decoded.id != volunteerId) {
      return res
        .status(403)
        .json({ message: "You are not authorized", data: "" });
    }

    const result = await updateVolunteer(volunteerId, skills, availability);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Volunteer not found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Volunteer updated successfully", data: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (decoded.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete volunteers.", data: "" });
    }

    const volunteerId = req.params.id;

    const result = await deleteVolunteer(volunteerId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Volunteer not found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Volunteer deleted successfully", data: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
