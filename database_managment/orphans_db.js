const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = require("./db_config");

async function getOrphan(id, token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the orphans");
    const [rows] = await pool.query("SELECT * FROM orphans where orphan_id = ? ;", [id]);
    if (rows.length === 0) return { user: "not found", statusCode: 404 };
    rows.forEach((row) => {
      delete row.password;
    });
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function getAllOrphans(token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the orphans");
    const [rows] = await pool.query("SELECT * FROM orphans");
    rows.forEach((row) => {
      delete row.password;
    });
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function addOrphanReq(name,age,gender,education_status,health_condition,orphanage_id,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to add orphans");
    const [rows] = await pool.query('insert into orphans (name,age,gender,education_status,health_condition,orphanage_id) values (?,?,?,?,?,?)',[name,age,gender,education_status,health_condition,orphanage_id]);
    return { message: "orphan added", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}



async function updateOrphan(id,name,age,gender,education_status,health_condition,orphanage_id,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to update orphans");
    const [rows] = await pool.query(`update orphans set name = ?, age = ?, gender = ?, education_status = ?, health_condition = ?, orphanage_id = ? where orphan_id = ?`, [name, age, gender, education_status, health_condition, orphanage_id, id]);
    return { message: "orphan updated", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}


async function deleteOrphan(id,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to delete orphans");
    const [rows] = await pool.query(`delete from orphans where orphan_id = ?`, [id]);
    return { message: "orphan deleted", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}




module.exports = {
  getOrphan,
  getAllOrphans,
  addOrphanReq,
  updateOrphan,
  deleteOrphan,
};