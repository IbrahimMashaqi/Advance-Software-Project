const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
  })
  .promise();

async function addApplication(volunteer_id, opportunity_id) {
  try {
    const [result] = await pool.execute(
      "INSERT INTO volunteer_applications (volunteer_id, opportunity_id, application_date, status) VALUES (?, ?, NOW(), 'pending')",
      [volunteer_id, opportunity_id]
    );

    return result;
  } catch (error) {
    console.error("Error inserting application:", error);
    throw error;
  }
}

async function getAllApplications() {
  try {
    const [rows] = await pool.query("SELECT * FROM volunteer_applications");
    return rows;
  } catch (err) {
    throw err.message;
  }
}

async function getApplication(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM volunteer_applications WHERE application_id = ?",
      [id]
    );
    return rows;
  } catch (err) {
    throw err.message;
  }
}

async function updateApplication(applicationId, status) {
  const [result] = await pool.query(
    "UPDATE volunteer_applications SET status = ? WHERE application_id = ?",
    [status, applicationId]
  );
  return result;
}

async function deleteApplication(applicationId) {
  const [result] = await pool.query(
    "DELETE FROM volunteer_applications WHERE application_id = ?",
    [applicationId]
  );
  return result;
}

module.exports = {
  addApplication,
  getAllApplications,
  getApplication,
  updateApplication,
  deleteApplication,
};
