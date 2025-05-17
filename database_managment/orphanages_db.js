const mysql = require("mysql2");
const bcrypt = require ('bcryptjs')
const { orphanCheck } = require('../database_managment/orphans_db.js');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
}).promise();

async function getAllOrphanages(token) {
    try{
        const decodedToken = jwt.decode(token)
        const role = decodedToken.role
        if(role !== 'admin')throw new Error ('you are not allowed to get the orphanages')
        const [rows] = await pool.query('select * from orphanages');
        return rows;
    }catch (err) {
    throw err       
    }
    
}

async function getOrphanageById(id,token) {
    try{
        const decodedToken = jwt.decode(token)
        const role = decodedToken.role
        if(role !== 'admin')throw new Error ('you are not allowed to get the orphanages')
        const [rows] = await pool.query('select * from orphanages where orphanage_id = ?', [id]);
        return rows[0];
    } catch (err) { 
    throw err}
}

async function createOrphanage(orphanage_id,name, location, contact_email, contact_phone, verified,token) {
    try{
        const decodedToken = jwt.decode(token)
        const role = decodedToken.role
        if(role !== 'admin')throw new Error ('you are not allowed to add to the orphanages')
        const found = await orphanageCheck(orphanage_id)
        if (found)
        throw new Error ('orphanage alredy exists')
       const [rows] = await pool.query(`insert into orphanages (name, location, contact_email, contact_phone, verified)values (?, ?, ?, ?, ?)`, [name, location, contact_email, contact_phone, verified]);
        return {id :rows.insertId ,message : "orphanage created successfully"};    
    }
    catch (err) {
        throw err
    }
}

async function updateOrphanage(id, data,token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to add to the orphanages')
    const { name, location, contact_email, contact_phone, verified } = data;
    const [rows] = await pool.query(`update orphanages set name = ?, location = ?, contact_email = ?, contact_phone = ?, verified = ? where orphanage_id = ?`, [name, location, contact_email, contact_phone, verified, id]);
    return {id :rows.insertId ,message : "orphanage updated successfully"};
}
    catch (err) {
        throw err
    }
}

async function deleteOrphanage(id,token) {
     try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to add to the orphanages')
    const found = await orphanageCheck(id)
    if (!found)
    throw new Error ('orphanage does not exist')
    const [rows] = await pool.query('DELETE FROM orphanages WHERE orphanage_id = ?', [id]);
    return {id :rows.insertId ,message : "orphanage deleted "};
}
    catch (err) {
        throw err
    }
}

async function getOrphansByOrphanage(orphanageId,token) {
    try {
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get orphans')
    const [rows] = await pool.query('select * from orphans where orphanage_id = ?', [orphanageId]);
    return rows;
    } catch (err) {
    throw err
    }
    
}

async function assignOrphanToOrphanage(orphanId, orphanageId,token) {
    try {
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to assign orphans')
    const found = await orphanageCheck(orphanageId)
    if (!found)
            throw new Error ('orphanage does not exist')
     const found2 = await orphanCheck(orphanId,token)
    if (!found2)
              throw new Error ('orphan does not exist')
    const [rows] = await pool.query('update orphans set orphanage_id = ? where orphan_id = ?', [orphanageId, orphanId]);
     return {id :rows.insertId ,message : "orphan assigned "};
    } catch (err) {
    throw err
     }
}

async function unassignOrphanFromOrphanage(orphanageId,orphanId,token) {
    try {
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to assign orphans')
    const found = await orphanageCheck(orphanageId,token)
    if (!found)
            throw new Error ('orphanage does not exist')
     const found2 = await orphanCheck(orphanId)
    if (!found2)
              throw new Error ('orphan does not exist')
    const [rows] = await pool.query('update orphans set orphanage_id = NULL where orphan_id = ?', [orphanId]);
    return {id :rows.insertId ,message : "orphan unassigned "};

}
    catch (err) {
    throw err
    }
}


async function orphanageCheck(orphanage_id) {
  try {
    const [rows] = await pool.query('select 1 from orphanages where orphanage_id = ?', [orphanage_id]);
    return rows.length > 0; 
  } catch (error) {
    console.error('error checking :', error);
    throw error; 
  }
}





async function getVolunteersByOrphanage(orphanageId,token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get volunteers')
    const [rows] = await pool.query(`select * from volunteer_opportunities where orphanage_id = ?`, [orphanageId]);
    return rows;
    } catch (err) {
    throw err
    }
}


module.exports = {
    getOrphansByOrphanage,
    assignOrphanToOrphanage,
    unassignOrphanFromOrphanage,
    getAllOrphanages,
    getOrphanageById,
    createOrphanage,
    updateOrphanage,
    deleteOrphanage,
    getVolunteersByOrphanage
};