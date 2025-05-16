const pool = require("./db_config");

async function addVolunteer(user_id, skills, availability) {
  try {
    const [result] = await pool.query(
      "INSERT INTO volunteers (user_id, skills, availability) VALUES (?, ?, ?)",
      [user_id, skills, availability]
    );

    return result;
  } catch (err) {
    throw err;
  }
}
async function isVolunteer(id) {
  try {
    const [result] = await pool.query("SELECT role FROM users WHERE id = ?", [
      id,
    ]);

    if (result.length === 0) {
      return false;
    }

    const userRole = result[0].role?.toLowerCase();
    return userRole === "volunteer";
  } catch (err) {
    throw err;
  }
}

async function getAllVolunteers() {
  try {
    const [rows] = await pool.query("select * from volunteers");
    return rows;
  } catch (err) {
    throw err;
  }
}

async function getVolunteer(id) {
  try {
    const [rows] = await pool.query(
      "select * from volunteers where volunteer_id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    throw err;
  }
}

async function updateVolunteer(volunteerId, skills, availability) {
  try {
    const [result] = await pool.query(
      "UPDATE volunteers SET skills = COALESCE(?, skills), availability = COALESCE(?, availability) WHERE volunteer_id = ?",
      [skills, availability, volunteerId]
    );
    return result;
  } catch (err) {
    throw err;
  }
}

async function deleteVolunteer(volunteerId) {
  try {
    const [result] = await pool.query(
      "DELETE FROM volunteers WHERE volunteer_id = ?",
      [volunteerId]
    );
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  addVolunteer,
  isVolunteer,
  getAllVolunteers,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
