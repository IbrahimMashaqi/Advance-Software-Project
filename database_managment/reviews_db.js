const mysql = require("mysql2");
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
}).promise();


async function getReviewsByOrphanage(orphanageId, token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the reviews')
    const [rows] = await pool.query(`select * from reviews where orphanage_id = ?`, [orphanageId]);
    return rows;
    }
    catch (err) {
        throw err; 
    }
}


async function addReviewToOrphanage(orphanageId, donorId, rating, comment, reviewDate, token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to add reviews')
    const [rows] = await pool.query(`insert into reviews (orphanage_id, donor_id, rating, comment, review_date) values (?, ?, ?, ?, ?)`, [orphanageId, donorId, rating, comment, reviewDate]);
    return {id :rows.insertId ,message : "review added successfully"};
}
    catch (err) {
        throw err; 
    }

}


async function deleteReview(reviewId, token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to delete reviews')
    const found = await reviewCheck(reviewId)
    if (!found)
    throw new Error ('review does not exist')
    const [rows] = await pool.query(`delete from reviews where review_id = ?`, [reviewId]);
    return {id :rows.insertId ,message : "review deleted successfully"};
    }catch (err) {
    throw err; 
}
}

async function reviewCheck(reviewId) {
  try {
    const [rows] = await pool.query('select 1 from reviews where review_id = ?', [reviewId]);
    return rows.length > 0; 
  } catch (error) {
    console.error('error checking :', error);
    throw error; 
  }
}


module.exports={
  getReviewsByOrphanage,
  addReviewToOrphanage,
  deleteReview
};