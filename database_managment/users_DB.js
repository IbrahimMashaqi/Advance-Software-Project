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
    
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the users')
    const [rows] = await pool.query('SELECT * FROM users where id = ? ;',[id]);
    if(rows.length===0)
      return {user : "not found" , statusCode: 404}
    rows.forEach(row  => {delete row.password})
    return {user : rows , statusCode: 200}
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


async function getProfile(token) {
  try {

    decodedToken = jwt.decode(token)
    const [row] = await pool.query("SELECT * FROM users where id =?", [decodedToken.id])
    if(row.length===0)
      throw new Error
    
    row.forEach(ro => {delete ro.password})
    return row[0];
  }
  catch (error) {
    throw error;
  }

}

 
async function updateUser(token,name, password, role)  {
  try{
    decodedToken = jwt.decode(token)
    const id = decodedToken.id
    const [found] = await pool.query("select * from users where id = ?",[id])
    if(found.length===0)return ({message : "user not found",statusCode : 404})
    
    const hashedPass = await bcrypt.hash(password , 10)
    const [result] = await pool.query("UPDATE users SET username = ? , password = ? , role = ? WHERE id = ?", [name, hashedPass,role,id]) 
    const [rows] = await pool.query("select * from users where id = ?",[id])
    delete rows[0].password
    return {message : "user updated",statusCode :200 , rows}
  }
  catch(error) {
    console.log(error)
    return ({message :error.message ,statusCode : 500})  }
}

async function deleteUser(token, id){
  try{
    const decodedToken = jwt.decode(token)
    if(decodedToken.role!=='admin')
      throw new Error ('you are not allowed to delete users')
    const [result] = await pool.query("DELETE FROM users WHERE id = ?",[id])
    if(result.affectedRows===0)
      return {message : "user not found",statusCode :404}
    return {message : "user deleted",statusCode : 200}
  }
  catch(error){
    console.log(error)
    return ({message : error.message ,statusCode : 500})
  }
}

module.exports={
  
  getUser,
  getAllUsers,
  register,
  emailCheck,
  getProfile,
  updateUser,
  deleteUser
};