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


async function getAllDeliveries(token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the deliveries')
    const [rows] = await pool.query('select * from deliveries');
    return rows;
    }
    catch (err) {
        throw err; 
    }
}


async function getDeliveryById(id,token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the delivery')
    const [rows] = await pool.query('select * from deliveries where delivery_id = ?', [id]);
    return rows[0];
    }
    catch (err) {   
        throw err;
    }
}


async function createDelivery(donationId, deliveryAddress, status, trackingCode, token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to add a delivery')
    const [rows] = await pool.query(`insert into deliveries (donation_id, delivery_address, status, tracking_code) values (?, ?, ?, ?)`, [donationId, deliveryAddress, status, trackingCode]);
    return {id :rows.insertId ,message : "delivery added successfully"};    
    }
    catch (err) {
        throw err; 
    }
}


async function updateDelivery(deliveryId, deliveryAddress, status, trackingCode, token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to update a delivery')
    const found = await deliveryCheck(deliveryId)
    if (!found)
    throw new Error ('delivery does not exist')
    const [rows] = await pool.query(`update deliveries set delivery_address = ?, status = ?, tracking_code = ? where delivery_id = ?`, [deliveryAddress, status, trackingCode, deliveryId]);
    return {id :rows.insertId ,message : "delivery updated successfully"}; 
    }
    catch (err) {
        throw err; 
    }
}


async function deleteDelivery(deliveryId, token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to delete a delivery')
    const found = await deliveryCheck(deliveryId)
    if (!found)
    throw new Error ('delivery does not exist')
    const [rows] = await pool.query('delete from deliveries where delivery_id = ?', [deliveryId]);
    return {id :rows.insertId ,message : "delivery deleted successfully"}; 
    }   
    catch (err) {
        throw err; 
    }
}


async function deliveryCheck(deliveryId) {
  try {
    const [rows] = await pool.query('select 1 from deliveries where delivery_id = ?', [deliveryId]);
    return rows.length > 0; 
  } catch (error) {
    console.error('error checking :', error);
    throw error; 
  }
}




module.exports={
    getAllDeliveries,
    getDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery
};