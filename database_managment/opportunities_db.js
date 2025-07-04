const pool = require("./db_config");

async function addOpportunity(
  orphanage_id,
  title,
  description,
  posted_date,
  status
) {
  try {
    const [result] = await pool.execute(
      "INSERT INTO volunteer_opportunities (orphanage_id, title, description, posted_date, status) VALUES (?, ?, ?, ?, ?)",
      [orphanage_id, title, description, posted_date, status]
    );
    return result;
  } catch (err) {
    throw err;
  }
}

async function getAllOpportunities() {
  try {
    const [rows] = await pool.execute("SELECT * FROM volunteer_opportunities");
    return rows;
  } catch (err) {
    throw err;
  }
}

async function getOpportunityById(id) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM volunteer_opportunities WHERE opportunity_id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    throw err;
  }
}

async function updateOpportunity(id, title, description, status) {
  try {
    const [result] = await pool.execute(
      "UPDATE volunteer_opportunities SET title = ?, description = ?, status = ? WHERE opportunity_id = ?",
      [title, description, status, id]
    );
    return result;
  } catch (err) {
    throw err;
  }
}

async function deleteOpportunity(id) {
  try {
    const [result] = await pool.execute(
      "DELETE FROM volunteer_opportunities WHERE opportunity_id = ?",
      [id]
    );
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  addOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
};
