const jwt = require("jsonwebtoken");
const {
  addApplication,
  getAllApplications: getAllFromDB,
  getApplication,
  updateApplication,
  deleteApplication,
} = require("../database_managment/Application_db");

const createApplication = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can apply." });
    }

    const volunteer_id = req.user.id;
    const { opportunity_id } = req.body;

    if (!opportunity_id) {
      return res.status(400).json({ message: "opportunity_id is required." });
    }

    const result = await addApplication(volunteer_id, opportunity_id);
    res
      .status(201)
      .json({ message: "Application created successfully.", data: result });
  } catch (err) {
    console.error("Create Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can view all applications." });
    }

    const result = await getAllFromDB();
    res
      .status(200)
      .json({ message: "Applications retrieved successfully.", data: result });
  } catch (err) {
    console.error("Get All Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.role !== "admin" && req.user.id != id) {
      return res.status(403).json({ message: "You are not authorized." });
    }

    const result = await getApplication(id);
    if (result.length === 0) {
      return res
        .status(200)
        .json({ message: "No applications found", data: result });
    }

    res
      .status(200)
      .json({ message: "Application retrieved successfully.", data: result });
  } catch (err) {
    console.error("Get Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
};

const updateApplicationById = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);
    const applicationId = req.params.id;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    if (decoded.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "You are not authorized." });
    }

    const result = await updateApplication(applicationId, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res
      .status(200)
      .json({ message: "Application updated successfully", data: result });
  } catch (err) {
    console.error("Update Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const deleteApplicationById = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);
    const applicationId = req.params.id;

    if (decoded.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "You are not authorized" });
    }

    const result = await deleteApplication(applicationId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res
      .status(200)
      .json({ message: "Application deleted successfully", data: result });
  } catch (err) {
    console.error("Delete Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
};
