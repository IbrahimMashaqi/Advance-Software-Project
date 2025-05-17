const {
  getOrphanage,
  getAllOrphanages,
  addOrphanageReq,
  updateOrphanage,
  deleteOrphanage,
  getOrphansByOrphanage,
  assignOrphanToOrphanage,
  unassignOrphanFromOrphanage,
  getVolunteersByOrphanage
} = require("../database_managment/orphanages_db");

async function getOrphanages(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const result = await getAllOrphanages(token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getOrphanageById(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const result = await getOrphanage(id, token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}



async function addOrphanage(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const {name, location, contact_email, contact_phone, verified} = req.body
    const result = await addOrphanageReq(name, location, contact_email, contact_phone, verified,token)
    res.status(result.statusCode).json(result.message);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


async function upOrphanage(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const {name, location, contact_email, contact_phone, verified} = req.body
    const result = await updateOrphanage(id,name, location, contact_email, contact_phone, verified,token)
    res.status(result.statusCode).json(result.message);
  } catch (error) {

    res.status(500).send(error.message);
  }
}

async function delOrphanage(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = req.params.id;
    const result = await deleteOrphanage(id, token);
    res.status(result.statusCode).send(result.message);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

async function getOrphansFromOrphanage(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = req.params.id;
    const result = await getOrphansByOrphanage(id, token);
    res.status(result.statusCode).json(result.user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

async function assignOrphan(req, res) {
    try {
    const token = req.headers["authorization"].split(" ")[1];
    const OrphanageId = req.params.orphanageId;
    const OrphanId = req.params.orphanId;
    const result = await assignOrphanToOrphanage(OrphanageId, OrphanId, token);
    res.status(result.statusCode).json(result.message);
    } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}



async function unassignOrphan(req, res) {
    try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = req.params.id;
    const result = await unassignOrphanFromOrphanage(id, token);
    res.status(result.statusCode).json(result.message);
    } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}


async function getVolunteersFromOrphanage(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = req.params.id;
    const result = await getVolunteersByOrphanage(id, token);
    res.status(result.statusCode).json(result.user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}


module.exports = { getOrphanages, getOrphanageById, addOrphanage, upOrphanage, delOrphanage, getOrphansFromOrphanage, assignOrphan, unassignOrphan, getVolunteersFromOrphanage };