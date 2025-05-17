const {
  getAllEmergencies,
  createEmergency,
  getEmergencyById,
  updateEmergency,
  deleteEmergency,
} = require("../database_managment/Emergency_db");
const jwt = require("jsonwebtoken");
const notifyDonors = require("../controllers/email.controller");

const getAllEmergenciesHandler = async (req, res) => {
  try {
    const emergencies = await getAllEmergencies();
    res
      .status(200)
      .json({ message: "Retrieved successfully", data: emergencies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEmergencyHandler = async (req, res) => {
  try {
    if (req.user.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create emergencies." });
    }

    const { title, description, target_amount, start_date, status } = req.body;

    if (
      !title ||
      !description ||
      target_amount == null ||
      !start_date ||
      !status
    ) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    const emergency = req.body;
    const result = await createEmergency(emergency);
    const txt = `

    We are reaching out to inform you of an emergency situation:

    ${emergency.description}

    Start date: ${emergency.start_date}

    End date: ${emergency.end_date}

    Target ammount : ${emergency.target_amount}

    Amount raised : ${emergency.amount_raised}

    Your support can make a real difference in saving lives.

    Please consider donating urgently via our platform.

    Thank you for your continued support.

    – The HopeConnect Team`;
    console.log("BEFORE NOTIFY");

    await notifyDonors(emergency.title, txt);
    console.log("AFTER NOTIFY");
    res.status(201).json({ message: "Emergency created", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEmergencyByIdHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getEmergencyById(id);
    if (!result)
      return res.status(404).json({ message: "Emergency not found" });
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEmergencyHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.decode(token);
    if (decoded.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update emergencies." });
    }

    const id = req.params.id;
    const emergency = req.body;

    const result = await updateEmergency(id, emergency);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Emergency not found" });
    }
    res.status(200).json({ message: "Emergency updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEmergencyHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.decode(token);
    if (decoded.role.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete emergencies." });
    }

    const id = req.params.id;
    const result = await deleteEmergency(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Emergency not found" });
    }
    res.status(200).json({ message: "Emergency deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEmergenciesHandler,
  createEmergencyHandler,
  getEmergencyByIdHandler,
  updateEmergencyHandler,
  deleteEmergencyHandler,
};
