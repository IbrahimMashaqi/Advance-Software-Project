const express = require("express");
const app =express();
app.use(express.json());

const authRout = require('./routes/auth');
const userRout = require('./routes/users');
const sponsorRout = require ('./routes/sponsorshipManagement');
const donationRout = require ('./routes/Donation');
const volunteersRout = require ('./routes/volunteers');
const applicationssRout = require ('./routes/Applications');


app.use('/users',userRout.router);
app.use('/auth',authRout);
app.use('/sponsorship',sponsorRout)
app.use('/donations',donationRout)
app.use('/volunteers',volunteersRout)
app.use('/applications',applicationssRout)

app.listen(8000 , () =>{
console.log("iam litening at port 8000")
});