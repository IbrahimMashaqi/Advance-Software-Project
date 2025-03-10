const mysql = require("mysql2");
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken');
const { register } = require("./auth_db");
require('dotenv').config()



const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
}).promise();





async function getUser(id,token) {
  try {
    
    decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the users')
   
    const [rows] = await pool.query('SELECT * FROM users where id = ? ;',[id]);
    rows.forEach(row  => {delete row.password})
    return rows
  } catch (err) {
      throw err
  }
}

async function getAllUsers(token){
  try{
    decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the users')
    const [rows] = await pool.query('SELECT * FROM users');
    rows.forEach(row => {
      delete row.password;
    });
    return rows;
  }catch(err){
    throw err
  }
}



async function emailCheck(email) {
  try {
    const [rows] = await pool.query('SELECT 1 FROM users WHERE email = ?', [email]);
    return rows.length > 0; 
  } catch (error) {
    console.error('Error checking email:', error);
    throw error; 
  }
}

//  (async()=>{
//    const s=addUser('admin','admin@edu','123','admin')
//  })()


module.exports={
  
  getUser,
  getAllUsers,
  register,
  emailCheck
};