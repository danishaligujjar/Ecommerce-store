const express = require('express');
const router = express.Router();
const {signup, signin, signout} = require("../controllers/user");
const {userSignUpValidator} = require("../validator/index");

// Routes

router.post('/signup', userSignUpValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);


module.exports = router