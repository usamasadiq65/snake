const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');


const signToken = userID =>{
    return JWT.sign({
        iss : "NoobCoder",
        sub : userID
    },"NoobCoder",{expiresIn : "1h"});
}


userRouter.post('/register', async (req,res)=>{
    try {
        const { username,password,email } = req.body;
        
        const existingEmail = await User.findOne({email});
        if(existingEmail)
            return res.status(201).json({message : "Email is already registered", type: 'warning'});
        
        const existingUsername = await User.findOne({username});
        if(existingUsername)
            return res.status(201).json({message : "Username is already taken", type:'warning'});
        
        const newUser = new User({username,password,email});
        await newUser.save();
        res.status(201).json({message : "Account successfully created", type:'success'});
    } catch(err) {
        if(err.message && err.message.includes('User validation failed: username')){
            res.status(201).json({message : 'username length must be between 4 and 15 letters', type:'warning'});
        }else{
            console.error('Register error:', err);
            res.status(500).json({message : "Error has occured", msgError: true});
        }
    }
});


userRouter.post('/login', 
    function(req, res, next) {
        passport.authenticate('local',{session:false}, function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(200).json({message:info,type:'error'}); }
        req.user =user;
        next()
        })(req, res, next);
    },
    (req,res) => {
        const {_id,username,email} = req.user
        const token = signToken(_id);
        res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
        res.status(200).json({isAuthenticated : true ,user:{id:_id,username,email}});
    });


    userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
        res.clearCookie('access_token');
        res.json({success : true});
    });

userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {username,email,_id} =req.user;
    res.status(200).json({isAuthenticated : true,user:{username,email,_id}});
});

module.exports = userRouter;