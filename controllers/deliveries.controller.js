const {
  getDelivery,
  getAllDeliveries,
  addDeliveryReq,
  updateDelivery,
  deleteDelivery,
} = require("../database_managment/deliveries_db");

async function getDeliveries(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const result = await getAllDeliveries(token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getDeliveryById(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const result = await getDelivery(id, token);
    res.status(result.statusCode).json(result.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}



async function addDelivery(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const {donationId, deliveryAddress, status, trackingCode} = req.body
    const result = await addDeliveryReq(donationId, deliveryAddress, status, trackingCode,token)
    res.status(result.statusCode).json(result.message);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


async function upDelivery(req, res) {
  try {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    const id = req.params.id;
    const {deliveryAddress, status, trackingCode} = req.body
    const result = await updateDelivery(id, deliveryAddress, status, trackingCode, token)
    res.status(result.statusCode).json(result.message);
  } catch (error) {

    res.status(500).send(error.message);
  }
}

async function delDelivery(req, res) {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = req.params.id;
    const result = await deleteDelivery(id, token);
    res.status(result.statusCode).send(result.message);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}


module.exports = { getDeliveries, getDeliveryById, addDelivery, upDelivery, delDelivery };