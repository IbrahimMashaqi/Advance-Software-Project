const express=require("express");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const { login , register} = require('../database_managment/auth_db');
const router = express.Router()
router.use(express.json());



router.post("/login" ,async (req,res) => {
    try{
        const {email,password} =req.body;
        const result=await login(email,password)
        res.status(200).send({user:result.user, token : result.token})
    }
    catch(err){
        console.error(err)
        res.status(404).send('Email or password are not correct.')
    }

});

router.post ("/register", async (req,res) => {
    try{
        const {name,email,password,role} = req.body
        const data = await register(name,email,password,role)
        const result=await login(email,password)
        res.status(201).send({user:result.user, token : result.token})

    }
    
    catch(error){
        res.status(409).send(error.message)
    }
});


router.post('/logout' , (req,res) => {
    
});


module.exports = router