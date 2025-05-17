const {
  getOrphan,
  getAllOrphans,
  addOrphanReq,
  updateOrphan,
  deleteOrphan
} = require("../database_managment/orphans_db");

async function getOrphans(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const result = await getAllOrphans(token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getOrphanById(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const result = await getOrphan(id, token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}



async function addOrphan(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const {name,age,gender,education_status,health_condition,orphanage_id} = req.body
    const result = await addOrphanReq(name,age,gender,education_status,health_condition,orphanage_id,token)
    res.status(result.statusCode).json(result.message);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


async function upOrphan(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const {name,age,gender,education_status,health_condition,orphanage_id} = req.body
    const result = await updateOrphan(id,name,age,gender,education_status,health_condition,orphanage_id,token)
    res.status(result.statusCode).json(result.message);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function delOrphan(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = req.params.id;
    const result = await deleteOrphan(id, token);
    res.status(result.statusCode).send(result.message);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

module.exports = { getOrphans, getOrphanById, addOrphan, upOrphan, delOrphan };