const express = require("express");
const app =express();
app.use(express.json());

const authRout = require('./routes/auth')
const userRout = require('./routes/users');
app.use('/users',userRout)
app.use('/auth',authRout)


// (async () => {
//     await addUser('dono','email.com','123','donor')
// })()

app.listen(8000 , () =>{
console.log("iam litening at port 8000")
});