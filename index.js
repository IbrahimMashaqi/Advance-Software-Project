const express = require("express");
const app =express();
app.use(express.json());

const userRout = require('./routes/users')
app.use('/users',userRout)




app.listen(8000 , () =>{
console.log("iam litening at port 8000")
});