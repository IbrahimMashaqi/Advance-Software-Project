const jwt = require("jsonwebtoken");
const {
  addDonation,
  getAllDonations,
  getDonation,
  updateDonation,
  deleteDonation,
} = require("../database_managment/Donation_db");

const addDonationHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (decoded.role.toLowerCase() !== "donor") {
      return res
        .status(403)
        .json({ message: "Only donors can add donations." });
    }

    const donorId = decoded.id;

    const { amount, category, payment_method, status, emergency_id } = req.body;

    if (!amount || !category || !payment_method || !status) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const result = await addDonation(
      donorId,
      amount,
      category,
      payment_method,
      status,
      emergency_id
    );

    res.status(201).json({
      message: "Donation created successfully.",
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getAllDonationsHandler = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "admin") {
      res
        .status(403)
        .json({ data: "", message: "You are not authorized (Admin only)." });
    }

    const result = await getAllDonations();
    if (result.length === 0) {
      return res.status(404).json({ message: "No donations found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Donations retrieved successfully", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getDonationByIdHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decodedToken = jwt.decode(token);

    if (decodedToken.role.toLowerCase() !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to perform this action.",
        data: "",
      });
    }

    const id = req.params.id;
    const result = await getDonation(id);

    if (result.length === 0) {
      return res.status(200).json({ message: "No donations found", data: "" });
    }

    res
      .status(200)
      .json({ message: "Donation found successfully.", data: result });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const updateDonationHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (decoded.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }

    const donation_id = req.params.id;
    const { amount, category, donation_date, payment_method, status } =
      req.body;

    const validCategories = ["general", "education", "medical", "other"];
    const validStatuses = ["pending", "completed", "failed"];

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category." });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const result = await updateDonation(
      donation_id,
      amount,
      category,
      donation_date,
      payment_method,
      status
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Donation not found, no changes applied." });
    }

    res
      .status(200)
      .json({ message: "Donation updated successfully.", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const deleteDonationHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.decode(token);

    if (!decoded || decoded.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }

    const id = req.params.id;

    const result = await deleteDonation(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ data: "", message: "Donation not found." });
    }

    res
      .status(200)
      .json({ data: result, message: "Donation deleted successfully." });
  } catch (err) {
    res.status(500).json({ data: "", message: err.message });
  }
};

module.exports = {
  addDonationHandler,
  getAllDonationsHandler,
  getDonationByIdHandler,
  updateDonationHandler,
  deleteDonationHandler,
};
