const express=require("express");
const app =express();

app.get("/hi" , (req,res) => {
    res.send("hi");
});

app.listen(8000 , () =>{
    console.log("iam litening at port 8000")
});