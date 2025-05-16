const jwt = require("jsonwebtoken");
const {
  getAllSponsorShips,
  addSponsorShip,
  getSponsorShip,
  updateSponsorship,
  deleteSponsor,
} = require("../database_managment/sponser_db");

const getAllSponsorshipsHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decodedToken = jwt.decode(token);

    if (decodedToken.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ data: "", message: "Unauthorized: Admin access required." });
    }

    const result = await getAllSponsorShips();

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No sponsorships found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Sponsorships retrieved successfully", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addSponsorshipHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    decodedToken = jwt.decode(token);
    if (decodedToken.role.toLowerCase() !== "admin") {
      res
        .status(403)
        .json({ message: "Unauthorized: Admin access required.", data: "" });
    }

    const { orphan_id, donor_id } = req.body;
    const rows = await addSponsorShip(orphan_id, donor_id);
    const data = rows;
    res
      .status(201)
      .json({ data: data, message: "Sponsorship added successfully." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: "", message: err.message });
  }
};

const getSponsorshipByIdHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    decodedToken = jwt.decode(token);
    if (decodedToken.role.toLowerCase() !== "admin") {
      res
        .status(403)
        .json({ message: "Unauthorized: Admin access required.", data: "" });
    }

    const id = req.params.id;
    const result = await getSponsorShip(id);

    if (result.length === 0) {
      return res
        .status(200)
        .json({ message: "No sponsorship found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Sponsorship found successfully.", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateSponsorshipHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (decoded.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Admin access required." });
    }

    const id = req.params.id;
    const { status, end_date, start_date } = req.body;

    const validStatuses = ["active", "completed", "cancelled", "pending"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        data: "",
        message:
          "Invalid status value. Use: active, completed, cancelled, pending.",
      });
    }

    const result = await updateSponsorship(id, status, end_date, start_date);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ data: "", message: "Sponsorship not found." });
    }

    res
      .status(200)
      .json({ data: result, message: "Sponsorship updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: "", message: "Internal server error." });
  }
};

const deleteSponsorshipHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (!decoded || decoded.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Admin access required." });
    }

    const id = req.params.id;

    const result = await deleteSponsor(id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ data: "", message: "Sponsorship not found." });
    }

    res
      .status(200)
      .json({ data: result, message: "Sponsorship deleted successfully." });
  } catch (err) {
    res.status(500).json({ data: "", message: err.message });
  }
};

module.exports = {
  getAllSponsorshipsHandler,
  addSponsorshipHandler,
  getSponsorshipByIdHandler,
  updateSponsorshipHandler,
  deleteSponsorshipHandler,
};
