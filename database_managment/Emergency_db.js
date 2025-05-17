const pool = require("./db_config");

async function getAllEmergencies() {
  try {
    const [rows] = await pool.query("SELECT * FROM emergencies");
    return rows;
  } catch (error) {
    console.error("Error fetching emergencies:", error);
    throw new Error("Could not fetch emergencies");
  }
}

async function createEmergency(emergency) {
  try {
    const {
      title,
      description,
      target_amount,
      amount_raised = 0.0,
      start_date,
      end_date,
      status,
      orphanage_id,
    } = emergency;

    const [result] = await pool.query(
      `INSERT INTO emergencies 
        (title, description, target_amount, amount_raised, start_date, end_date, status, orphanage_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        target_amount,
        amount_raised,
        start_date,
        end_date,
        status,
        orphanage_id,
      ]
    );

    return { emergency_id: result.insertId, ...emergency };
  } catch (error) {
    console.error("Error creating emergency:", error);
    throw new Error("Could not create emergency");
  }
}

async function getEmergencyById(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM emergencies WHERE emergency_id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching emergency by ID:", error);
    throw new Error("Could not fetch emergency");
  }
}

async function updateEmergency(id, emergency) {
  try {
    const {
      title,
      description,
      target_amount,
      amount_raised,
      start_date,
      end_date,
      status,
      orphanage_id,
    } = emergency;

    const [result] = await pool.query(
      `UPDATE emergencies 
        SET 
        title = COALESCE(?, title), 
        description = COALESCE(?, description), 
        target_amount = COALESCE(?, target_amount), 
        amount_raised = COALESCE(?, amount_raised), 
        start_date = COALESCE(?, start_date), 
        end_date = COALESCE(?, end_date), 
        status = COALESCE(?, status), 
        orphanage_id = COALESCE(?, orphanage_id) 
        WHERE emergency_id = ?`,
      [
        title,
        description,
        target_amount,
        amount_raised,
        start_date,
        end_date,
        status,
        orphanage_id,
        id,
      ]
    );

    return result;
  } catch (error) {
    console.error("Error updating emergency:", error);
    throw new Error("Could not update emergency");
  }
}

async function deleteEmergency(id) {
  try {
    const [result] = await pool.query(
      "DELETE FROM emergencies WHERE emergency_id = ?",
      [id]
    );
    return result;
  } catch (error) {
    console.error("Error deleting emergency:", error);
    throw new Error("Could not delete emergency");
  }
}

module.exports = {
  getAllEmergencies,
  createEmergency,
  getEmergencyById,
  updateEmergency,
  deleteEmergency,
};
