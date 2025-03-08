const express=require("express");
const app =express();
app.use(express.json());
const jwt = require("jsonwebtoken")
require("dotenv").config();
const { login, getUser,getAllUsers, addUser,emailCheck } = require('../database_managment/users_DB');


app.post("/login" ,async (req,res) => {
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

app.get("/users" ,authenticateToken, async (req,res) => {
    try{
        const users=await getAllUsers()
        res.json(users)

    }catch(err){
        console.log(err)
        res.status(500).send(json({message: 'failed to find users', error: err.message}))
    }
})

app.get("/users/:id",authenticateToken,async(req,res) => {
    try{
        const id=req.params.id
        const user=await getUser(id)
        res.json(user)

    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

app.post("/users",authenticateToken,async (req,res) => {
    try{
        const {name,email,password,role}=req.body
        const found = await emailCheck(email)
        if(found) {
            throw new Error('email already exist')
        }
        const user = await addUser(name,email,password,role)
        const result =await login(email,password)
        const token = result.token
        const id = user.id
        res.status(201).json({
            ID : id,
            token : token
            })
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})


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








app.listen(8000 , () =>{
console.log("iam litening at port 8000")
});