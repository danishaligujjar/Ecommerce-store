const express = require('express');
const router = express.Router();
const {signup} = require("../controllers/user");
const {welcome} = require("../controllers/user");

// Routes

router.post('/signup', signup);
router.get('/', welcome);

module.exports = router