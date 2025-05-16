const express = require('express');
const router = express.Router();
require("dotenv").config();
const { getAllOrphanages,getOrphanageById,createOrphanage,updateOrphanage,deleteOrphanage,getOrphansByOrphanage,
assignOrphanToOrphanage,unassignOrphanFromOrphanage,getVolunteersByOrphanage} = require('../database_managment/orphanages_db.js');
const {getReviewsByOrphanage, addReviewToOrphanage} = require('../database_managment/reviews_db.js')
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


router.get('/', authenticateToken, async (req, res) => {
    try {
        const header=req.headers["authorization"]
        const token= header && header.split(' ')[1]
        const orphanages = await getAllOrphanages(token);
        res.json(orphanages);
    } catch (err) {
        res.status(409).send(err.message);
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const header=req.headers["authorization"]
        const token= header && header.split(' ')[1]
        const data = await getOrphanageById(req.params.id, token);
        if (!data) return res.status(404).send("orphanage not found");
        res.json(data);
    } catch (err) {
        res.status(409).send(err.message);
    }
});

router.post('/createOrphanage', authenticateToken, async (req, res) => {
    try {
        const header=req.headers["authorization"]
        const token= header && header.split(' ')[1]
        const id=req.params.id
        const {orphanage_id, name, location, contact_email, contact_phone, verified} = req.body;
        const data = await createOrphanage(orphanage_id, name, location, contact_email, contact_phone, verified,token);
        res.status(201).json({message: data.message, data:data.id});
    } catch (err) {
        res.status(409).send(err.message);
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const id=req.params.id
        const { name, location, contact_email, contact_phone, verified } = req.body;
        const data = await updateOrphanage(id, { name, location, contact_email, contact_phone, verified },token);
        if (!data) return res.status(404).send("orphanage not found");
        res.status(201).json({message: data.message, data:data.id});
    } catch (err) {
        res.status(409).send(err.message);
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const id=req.params.id
        const data = await deleteOrphanage(id,token);
        if (!data) return res.status(404).send("Orphanage not found");
        res.status(201).json({message: data.message, data:data.id});
    } catch (err) {
        res.status(409).send(err.message);
    }
});

router.get('/:id/orphans', authenticateToken, async (req, res) => {
  try {
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    const id=req.params.id
    const orphans = await getOrphansByOrphanage(id,token);
    res.status(201).json(orphans);
  } catch (err) {
    res.status(409).send(err.message);
  }
});

router.post('/:orphanageId/assign/:orphanId', authenticateToken, async (req, res) => {
  try {
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    const idOfOrphan=req.params.orphanId
    const idOfOrphanage=req.params.orphanageId
    const data = await assignOrphanToOrphanage(idOfOrphan, idOfOrphanage,token);
    res.status(201).json({message: data.message, data:data.id});
  } catch (err) {
    res.status(409).send(err.message);
  }
});

router.delete('/:orphanageId/unassign/:orphanId', authenticateToken, async (req, res) => {
  try {
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    const idOfOrphan=req.params.orphanId
    const idOfOrphanage=req.params.orphanageId 
    const data = await unassignOrphanFromOrphanage(idOfOrphanage,idOfOrphan,token);
    res.status(201).json({message: data.message, data:data.id});
  } catch (err) {
    res.status(409).send(err.message);
  }
});



router.get('/:id/volunteers', authenticateToken, async (req, res) => {
    try {
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const orphanageId = req.params.id;
        const volunteers = await getVolunteersByOrphanage(orphanageId,token);
        res.json(volunteers);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
});

// GET all reviews for an orphanage
router.get('/:id/reviews', authenticateToken, async (req, res) => {
    try{
        console.log("here")
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const orphanageId = req.params.id;
        const reviews = await getReviewsByOrphanage(orphanageId,token);
        res.json(reviews);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
});

// POST a new review to an orphanage
router.post('/:id/reviews', authenticateToken, async (req, res) => {
    try{
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]        
    const { donorId, rating, comment } = req.body;
    const orphanageId = req.params.id;
    const reviewDate = new Date();
    const data = await addReviewToOrphanage(orphanageId, donorId, rating, comment, reviewDate,token);
    res.status(201).json({ message: 'Review added successfully' });
    }
    catch (error) {
        res.status(409).json({ error: error.message });
    }
});

module.exports=router

