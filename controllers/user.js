const User = require('../models/use')

exports.signup = (req, res)=>{
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user)=>{
        if(err){
            return err.res(400).json({
                err
            })
        }
        res.json({
            user
        })
    })
}