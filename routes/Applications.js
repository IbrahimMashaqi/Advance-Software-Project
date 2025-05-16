const express = require("express");
const { authenticateToken } = require("./users");
const {
  addApplication,
  getAllApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require("../database_managment/Application_db");
const router = express.Router();
router.use(express.json());
const jwt = require("jsonwebtoken");

router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({
        message: "Only volunteers can perform this action.",
      });
    }

    const volunteer_id = req.user.id;
    const { opportunity_id } = req.body;

    if (!opportunity_id) {
      return res.status(400).json({ message: "opportunity_id is required." });
    }

    const result = await addApplication(volunteer_id, opportunity_id);

    res.status(201).json({
      message: "Application created successfully.",
      data: result,
    });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can perform this action.",
      });
    }

    const result = await getAllApplications();

    res.status(201).json({
      message: "Application retrieved successfully.",
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving application:", err);
    res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "volunteer") {
      return res.status(403).json({
        message: "You are not authorized.",
      });
    }

    const id = req.params.id;

    if (req.user.role.toLowerCase() !== "admin" && req.user.id != id) {
      return res
        .status(403)
        .json({ message: "You are not authorized.", data: "" });
    }

    const result = await getApplication(id);

    if (result.length === 0) {
      return res
        .status(200)
        .json({ message: "No applications found", data: result });
    }

    res.status(200).json({
      message: "Application retrieved successfully.",
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving application:", err);
    res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    const applicationId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "rejected"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        data: "",
        message: "Invalid status value.('pending','accepted','rejected')",
      });
    }

    if (decoded.role.toLowerCase() !== "admin" && decoded.id != decoded.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized", data: "" });
    }

    const result = await updateApplication(applicationId, status);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Application not found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Application updated successfully", data: result });
  } catch (err) {
    console.error("Error updating application:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    const applicationId = req.params.id;

    if (decoded.role.toLowerCase() !== "admin" && decoded.id != decoded.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized", data: "" });
    }

    const result = await deleteApplication(applicationId);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Application not found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Application deleted successfully", data: result });
  } catch (err) {
    console.error("Error deleting application:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
