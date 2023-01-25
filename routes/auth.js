const express = require('express');
const router = express.Router();
const {signup, signin, signout, requireSignin} = require("../controllers/auth");
const {userSignUpValidator} = require("../validator/index");

// Routes

router.post('/signup', userSignUpValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.get('/greet', requireSignin, (req, res)=>{
    res.send("Welcome Sir")
})


module.exports = router