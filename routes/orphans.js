const express = require('express');
const router = express.Router();
require("dotenv").config();
const { updateOrphan,deleteOrphan,getOrphans,getOrphan,addOrphan} = require('../database_managment/orphans_db.js');
router.use(express.json());
const jwt = require('jsonwebtoken');



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


router.get("/" ,authenticateToken, async (req,res) =>  {
    try{
    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    const orphans= await getOrphans(token)
    res.json(orphans)
    }catch(error){
        res.status(409).send(error.message)
    }

});

router.get("/:id",authenticateToken,async(req,res) => {
    try{
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const id=req.params.id
        const result=await getOrphan(id,token)
        res.status(result.statusCode).json(result.orphan)

    }catch(error){
        res.status(409).send(error.message)
    }
})


router.post("/addOrphan",authenticateToken,async (req,res) => {
    try{
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const id=req.params.id
        const {orphan_id,name,age,gender,education_status,health_condition,orphanage_id} = req.body
        const data = await addOrphan(orphan_id,name,age,gender,education_status,health_condition,orphanage_id,token)
        res.status(201).json({message: data.message, data:data.id});
    }
    
    catch(error){
        res.status(409).send(error.message)
    }
});


router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const id=req.params.id
        const {name, age, gender, education_status, health_condition, orphanage_id} = req.body;
        const data = await updateOrphan(id, {name, age, gender, education_status, health_condition, orphanage_id}, token);
        if (!data) return res.status(404).json({ message: 'orphan not found' });
        res.status(201).json({message: data.message, data:data.id});
    } catch (error) {
        res.status(409).send(error.message);
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const id=req.params.id
        const data = await deleteOrphan(id, token);
        if (!data) return res.status(404).json({ message: 'orphan not found' });
        res.status(201).json({message: data.message, data:data.id});
    } catch (error) {
        res.status(409).send(error.message);
    }
});

module.exports=router
