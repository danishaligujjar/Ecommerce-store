const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandlers')
const jwt = require('jsonwebtoken') // to generate signed tokens
const expressJwt = require('express-jwt') // for authorization checking

exports.signup = (req, res)=>{
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user)=>{
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        })
    })
}



exports.signin = (req, res)=>{
    // find user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "User with that name does not exist. Please Sign Up"
               });
        }
            // if user exists, make sure email and password are correct
            // create authenticate method in user model
            if(!user.authenticate(password)){
                return res.status(401).json({
                    error: "Email and password do not match"
                })
            }


            //generate signed token with userid and secret
            const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET);

            //persist the token as 't 'in cookie with expiry date
            res.cookie('t', token, {expire: new Date() + 9999});

            // return response with user and token to frontend
            const {_id, name, email, role} = user
            return res.json({token, user:{_id, name, email, role}});
    });

}

exports.signout = (req, res)=>{
    res.clearCookie('t')
    res.json({message: 'You are signed out'})
};