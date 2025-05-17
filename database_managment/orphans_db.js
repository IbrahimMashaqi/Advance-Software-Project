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

async function getOrphans(token) {
  try {
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the orphans')
    const [rows] =  await pool.query('SELECT * FROM orphans');
    
    return rows;

  } catch (err) {
      throw err
  }
}



async function getOrphan(orphan_id,token) {
  try {
    
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the orphans')
    const [rows] = await pool.query('SELECT * FROM orphans where orphan_id = ? ;',[orphan_id]);
    if(rows.length===0)
      return {orphan : "not found" , statusCode: 404}
    return {orphan : rows , statusCode: 200}
  } catch (err) {
      throw err
  }
}


async function addOrphan(orphan_id,name,age,gender,education_status,health_condition,orphanage_id,token){
  try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the orphans')
    const found = await orphanCheck(orphan_id)
    if (found)
         throw new Error ('orphan alredy exists')
    const [result]=await pool.query('insert into orphans (name,age,gender,education_status,health_condition,orphanage_id) values (?,?,?,?,?,?)',[name,age,gender,education_status,health_condition,orphanage_id]);
    return {id :result.insertId ,message : "orphan added successfully"};
}catch(error){
    throw error
  }
}

async function orphanCheck(orphan_id) {
  try {
    const [rows] = await pool.query('select 1 from orphans where orphan_id = ?', [orphan_id]);
    return rows.length > 0; 
  } catch (error) {
    console.error('error checking :', error);
    throw error; 
  }
}


async function updateOrphan(id, token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the orphans')
    const { name, age, gender, education_status, health_condition, orphanage_id } = orphanData;
    const [rows] = await pool.query(`update orphans set name = ?, age = ?, gender = ?, education_status = ?, health_condition = ?, orphanage_id = ? where orphan_id = ?`, [name, age, gender, education_status, health_condition, orphanage_id, id]);
    return {id :rows.insertId ,message : "orphan updated successfully"};
    }
    catch(error){
        throw error
    }
}

async function deleteOrphan(id,token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get the orphans')
    const found = await orphanCheck(id)
    if (!found)
    throw new Error ('orphan does not exist')
    const [rows] = await pool.query(`delete from orphans where orphan_id = ?`, [id]);
    return {id :rows.insertId ,message : "orphan deleted successfully"};
    }
    catch(error){
        throw error
    }
}



module.exports={
  orphanCheck,
  updateOrphan,
  deleteOrphan,
  getOrphans,
  getOrphan,
  addOrphan
};