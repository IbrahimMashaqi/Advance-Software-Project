
const express=require("express");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const { getUser , getAllUsers , getProfile , updateUser, deleteUser } = require('../database_managment/users_DB');
const {login} = require ('../database_managment/auth_db')
const router = express.Router()
router.use(express.json());

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

// router.post("/login" ,async (req,res) => {
//     try{
//         const {email,password} =req.body;
//         const result=await login(email,password)
//         res.status(200).send({user:result.user, token : result.token})
//     }
//     catch(err){
//         console.error(err)
//         res.status(404).send('Email or password are not correct.')
//     }

// });

router.get("/" ,authenticateToken, async (req,res) => {
    try{
        const header=req.headers["authorization"]
        const token= header && header.split(' ')[1]
        const users=await getAllUsers(token)
        res.json(users)

    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})

router.get("/:id",authenticateToken,async(req,res) => {
    try{
        const header = req.headers['authorization']
        const token = header && header.split(' ')[1]
        const id=req.params.id
        const result=await getUser(id,token)
        res.status(result.statusCode).json(result.user)

    }catch(error){
        res.status(500).send(error.message)
    }
})


router.post("/profile",authenticateToken,async (req,res) => {

    try{
        const token = req.headers["authorization"].split(" ")[1]
        const user = await getProfile(token)
        res.send(user)        
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})

router.put("/profile",authenticateToken,async (req,res) => {

    try{
        const {name,password,role}=req.body
        
        const token = req.headers["authorization"].split(" ")[1]
        const result = await updateUser(token,name,password,role)
        res.status(result.statusCode).send(result.rows)

    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})



router.delete("/:id",authenticateToken, async (req,res) => {
    try{
        const token = req.headers["authorization"].split(" ")[1]
        const result = await deleteUser(token,req.params.id)
        res.status(result.statusCode).send(result.message)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})












module.exports=router