const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = require("./db_config");

async function getDelivery(id, token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the delivery");
    const [rows] = await pool.query("SELECT * FROM deliveries where delivery_id = ? ;", [id]);
    if (rows.length === 0) return { user: "not found", statusCode: 404 };
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function getAllDeliveries(token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the deliveries");
    const [rows] = await pool.query("SELECT * FROM deliveries");
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function addDeliveryReq(donationId, deliveryAddress, status, trackingCode,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to add deliveries");
    const [rows] = await pool.query(`insert into deliveries (donation_id, delivery_address, status, tracking_code) values (?, ?, ?, ?)`, [donationId, deliveryAddress, status, trackingCode]);
    return { message: "delivery added", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}



async function updateDelivery(id, deliveryAddress, status, trackingCode, token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role
    if (role !== "admin")
      throw new Error("you are not allowed to update deliveries");
    const [rows] = await pool.query(`update deliveries set delivery_address = ?, status = ?, tracking_code = ? where delivery_id = ?`, [deliveryAddress, status, trackingCode, id]);
    return { message: "delivery updated", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}


async function deleteDelivery(id,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to delete deliveries");
    const [rows] = await pool.query(`delete from deliveries where delivery_id = ?`, [id]);
    return { message: "delivery deleted", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}



module.exports = {
    getDelivery,
    getAllDeliveries,
    addDeliveryReq,
    updateDelivery,
    deleteDelivery
};