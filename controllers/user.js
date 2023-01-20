const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandlers')

exports.signup = (req, res)=>{
    console.log("req.body", req.body);
    res.json({n:'nnnnnnnnn'});
    const user = new User(req.body);
    user.save((err, user)=>{
        if(err){
            return err.res(400).json({
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

exports.welcome=(req, res)=>{
    res.send('welcome sir')
}