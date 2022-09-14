
// mqxiorsgcnepyrvh
const express = require('express');
const router = express.Router();
const userModel = require('../database/models/userModel');
let session = require("express-session");
let cookieParser = require("cookie-parser");
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "rakeshdhariwal61@gmail.com",
        pass: "mqxiorsgcnepyrvh"
    }
});


const oneDay = 1000*60*60*24;
router.use(session({
    secret: "This is my own secret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay},
    resave: false
}));
router.use(cookieParser());

// login api
router.get('/login', async (req, res)=>{
    let user =  await userModel.findOne({email: req.body.email});
    if(user && user.password == req.body.password){
        req.session.email = user.email;
        console.log(req.session.id);
        res.send("Login Success");
    }
    else{
        res.send("Auth failed");
    }
    
});

// sign up --area

router.post('/signup', async (req, res)=>{
    let user = await userModel.findOne({email: req.body.email});
    console.log(user);
    if(user!=null){
        res.send("User already present");
    }
    else{
        req.session.fullName = req.body.fullName;
        req.session.email = req.body.email;
        req.session.password = req.body.password;
        let mailOptions = {
            from: "monkeyapp@help.com",
            to: "rakeshdhariwal61@gmail.com",
            subject: "Verify Email Password",
            text: `Please update your password. [POST] http://localhost:3000/verify/${req.session.id}`
        }
        transporter.sendMail(mailOptions, function(error,result) {
            if(error) {
                console.log("Failed to send verification mail");
                res.send("Failed to send verification mail"+error);
            } else {
                console.log("Verification mail sent : " + result.response);
                res.send("Verification mail sent : " + result.response);
            }
        });
        
    }

});

// verify email

router.post('/verify/:id', async (req, res)=>{
    if(req.session.id === req.params.id){
        const user = new userModel(req.body);
        user.save((err, result)=>{
            if(result){
                res.send("Sign Up Success Email Verified");
            }
            else{
                res.send("Failed: "+err);
            }
        });
    }
    else{
        res.send("Session Time Out :(");
    }

});




/// signup end

// forgetpassword --> send mail with link to update password

router.post('/forgetpassword', async (req, res)=>{
    let user = userModel.findOne({email:req.body.email});
    if(user){
        req.session.email = req.body.email;
        let mailOptions = {
            from: "monkeyapp@help.com",
            to: "rakeshdhariwal61@gmail.com",
            subject: "Update Password",
            text: `Please update your password. [PUT] http://localhost:3000/resetpassword/${req.session.id} Sent by nodemailer using node.js`
        }
        transporter.sendMail(mailOptions, function(error,result) {
            if(error) {
                console.log("Failed to send");
                res.send(error);
            } else {
                console.log("Email sent : " + result.response);
                res.send(result.response);
            }
        });
    }
    else{
        res.send("No user found");
    }

});

// forget password reset

router.put('/resetpassword/:id', (req, res)=>{
    if(req.params.id === req.session.id){
        console.log(req.session.email);
        userModel.findOneAndUpdate({email: req.session.email},
            {
                password: req.body.password
            },
                { new: true },
                (err, result) => {
                    if (!err)
                        res.send('Update Success');
                    else 
                        res.send("Error while updating: " + err);
                }
            );
    }
    else res.send("Session time out");
})
module.exports = router;