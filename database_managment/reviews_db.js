const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("./db_config");


async function getAllReviews(token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the reviews");
    const [rows] = await pool.query("SELECT * FROM reviews");
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function getReviewsById(id, token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the reviews");
    const [rows] = await pool.query(`select * from reviews where orphanage_id = ?`, [id]);
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function addReviewReq(orphanageId, donorId, rating, comment, reviewDate,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to add reviews");
    const [rows] = await pool.query(`insert into reviews (orphanage_id, donor_id, rating, comment, review_date) values (?, ?, ?, ?, ?)`, [orphanageId, donorId, rating, comment, reviewDate]);
    return { message: "review added", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}



async function deleteReview(id,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to delete reviews");
    const [rows] = await pool.query(`delete from reviews where review_id = ?`, [id]);
    return { message: "review deleted", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}



module.exports = {
  getAllReviews,
  getReviewsById,
  addReviewReq,
  deleteReview
};