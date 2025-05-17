const express = require('express');
const router = express.Router();
const {getAllDeliveries, getDeliveryById, createDelivery, updateDelivery, deleteDelivery} = require('../database_managment/deliveries_db.js');
router.use(express.json());
const jwt = require('jsonwebtoken');
require("dotenv").config();

function authenticateToken(req,res,next){

    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    if(token==null)return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err)
             return res.sendStatus(403)

        req.user=user

        next() 
    })
}


router.get('/', authenticateToken, async (req, res) => {
    try{
    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    const deliveries = await getAllDeliveries(token);
    res.json(deliveries);
    }
    catch (err) {
        res.status(409).send(err.message);
    }
});


router.get('/:id', authenticateToken, async (req, res) => {
    try{
    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    const deliveryId = req.params.id;
    const delivery = await getDeliveryById(deliveryId, token);
    if (delivery) {
        res.json(delivery);
    } else {
        res.status(404).json({ message: 'delivery not found' });
    }
    }
    catch (err) {
        res.status(409).send(err.message);
    }
});


router.post('/', authenticateToken, async (req, res) => {
    try{
    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    const { donationId, deliveryAddress, deliveryDate, status, trackingCode } = req.body;
    const data = await createDelivery(donationId, deliveryAddress, status, trackingCode, token);
    res.status(201).json({message: data.message, data:data.id});
    }
    catch (err) {
        res.status(409).send(err.message);
    }
});


router.put('/:id', authenticateToken, async (req, res) => {
    try{
    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    const deliveryId = req.params.id;
    const { deliveryAddress, status, trackingCode } = req.body;
    const data = await updateDelivery(deliveryId, deliveryAddress, status, trackingCode, token);
    res.status(201).json({message: data.message, data:data.id});
    }
    catch (err) {
        res.status(409).send(err.message);
    }
});


router.delete('/:id', authenticateToken, async (req, res) => {
    try{
    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    const deliveryId = req.params.id;
    const data = await deleteDelivery(deliveryId, token);
    res.status(201).json({message: data.message, data:data.id});
    }
    catch (err) {
        res.status(409).send(err.message);
    }
});

module.exports = router;
