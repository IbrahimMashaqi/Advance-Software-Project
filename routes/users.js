
const express=require("express");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const { getUser,getAllUsers, addUser,getProfile } = require('../database_managment/users_DB');
const {login} = require ('../database_managment/auth_db')
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
        const user=await getUser(id,token)
        res.json(user)

    }catch(error){
        res.status(500).send(error.message)
    }
})


router.post("/",authenticateToken,async (req,res) => {
    try{
        const {name,email,password,role}=req.body
        const user = await addUser(name,email,password,role)
        const id = user && user.id
        const result =await login(email,password)
        const token = result.token
        res.status(201).json({
            ID : id,
            token : token
            })
    }catch(error){
        console.log(error);  
        res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get("/profile",authenticateToken , async (req,res) => {
    console.log("sedfghjjjjjjjjjjjjjjjjjj")
    try{
        const token = req.headers["authorization"].split(" ")[1]
        const user = await getProfile(token)
        res.send(user)
        console.log(user)

    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})



function authenticateToken(req,res,next){
    console.log("gfhjklkjhgfdghjk")

    const header=req.headers["authorization"]
    const token= header && header.split(' ')[1]
    if(token==null)return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err)
             return res.sendStatus(403)

        req.user=user
        console.log("pass")

        next() 
    })
}

module.exports=router