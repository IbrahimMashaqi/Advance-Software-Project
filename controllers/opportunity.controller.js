const {
  addOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} = require("../database_managment/opportunities_db");

const getAll = async (req, res) => {
  try {
    const opportunities = await getAllOpportunities();
    res
      .status(200)
      .json({ message: "Opportunities retrieved", data: opportunities });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving opportunities", error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const opportunity = await getOpportunityById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    res
      .status(200)
      .json({ message: "Opportunity retrieved", data: opportunity });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving opportunity", error: err.message });
  }
};

const create = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can add opportunities" });
    }

    const { orphanage_id, title, description, posted_date, status } = req.body;

    const validStatus = ["open", "closed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status", data: [] });
    }

    const result = await addOpportunity(
      orphanage_id,
      title,
      description,
      posted_date,
      status
    );
    res.status(201).json({ message: "Opportunity created", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating opportunity", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update opportunities" });
    }

    const { title, description, status } = req.body;

    const validStatus = ["open", "closed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status", data: [] });
    }

    const result = await updateOpportunity(
      req.params.id,
      title,
      description,
      status
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json({ message: "Opportunity updated", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating opportunity", error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete opportunities" });
    }

    const result = await deleteOpportunity(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json({ message: "Opportunity deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting opportunity", error: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
