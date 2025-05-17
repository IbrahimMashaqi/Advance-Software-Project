const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = require("./db_config");

async function getOrphanage(id, token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the orphanage");
    const [rows] = await pool.query("SELECT * FROM orphanages where orphanage_id = ? ;", [id]);
    if (rows.length === 0) return { user: "not found", statusCode: 404 };
    rows.forEach((row) => {
      delete row.password;
    });
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function getAllOrphanages(token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get the orphanages");
    const [rows] = await pool.query("SELECT * FROM orphanages");
    rows.forEach((row) => {
      delete row.password;
    });
    return { user: rows, statusCode: 200 };
  } catch (err) {
    throw err;
  }
}

async function addOrphanageReq(name, location, contact_email, contact_phone, verified,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to add orphanages");
    const [rows] = await pool.query(`insert into orphanages (name, location, contact_email, contact_phone, verified)values (?, ?, ?, ?, ?)`, [name, location, contact_email, contact_phone, verified]);
    return { message: "orphanage added", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}



async function updateOrphanage(id,name, location, contact_email, contact_phone, verified,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role
    if (role !== "admin")
      throw new Error("you are not allowed to update orphanages");
    const [rows] = await pool.query(`update orphanages set name = ?, location = ?, contact_email = ?, contact_phone = ?, verified = ? where orphanage_id = ?`, [name, location, contact_email, contact_phone, verified, id]);
    return { message: "orphanage updated", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}


async function deleteOrphanage(id,token) {
  try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to delete orphanages");
    const [rows] = await pool.query(`delete from orphanages where orphanage_id = ?`, [id]);
    return { message: "orphanage deleted", statusCode: 200 };
  } catch (err) {
    throw err;
  }
}




async function getOrphansByOrphanage(id,token) {
    try {
    const decodedToken = jwt.decode(token);
    const role = decodedToken.role;
    if (role !== "admin")
      throw new Error("you are not allowed to get orphans");
    const [rows] = await pool.query('select * from orphans where orphanage_id = ?', [id]);
    return { user: rows, statusCode: 200 };
    } catch (err) {
    throw err
    }
}

async function assignOrphanToOrphanage(OrphanageId, OrphanId, token) {
    try {
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to assign orphans')
    const [rows] = await pool.query('update orphans set orphanage_id = ? where orphan_id = ?', [OrphanageId, OrphanId]);
     return {statusCode: 200 ,message : "orphan assigned "};
    } catch (err) {
    throw err
     }
}


async function unassignOrphanFromOrphanage(OrphanId,token) {
    try {
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
      if(role !== 'admin')throw new Error ('you are not allowed to unassign orphans')
    const [rows] = await pool.query('update orphans set orphanage_id = NULL where orphan_id = ?', [OrphanId]);
    return {statusCode: 200 ,message : "orphan unassigned "};
    }catch (err) {
    throw err
    }
}


async function getVolunteersByOrphanage(id,token) {
    try{
    const decodedToken = jwt.decode(token)
    const role = decodedToken.role
    if(role !== 'admin')throw new Error ('you are not allowed to get volunteers')
    const [rows] = await pool.query(`select * from volunteer_opportunities where orphanage_id = ?`, [id]);
    return { user: rows, statusCode: 200 };
    } catch (err) {
    throw err
    }
}



module.exports = {
  getOrphanage,
  getAllOrphanages,
  addOrphanageReq,
  updateOrphanage,
  deleteOrphanage,
  getOrphansByOrphanage,
  assignOrphanToOrphanage,
  unassignOrphanFromOrphanage,
  getVolunteersByOrphanage
};