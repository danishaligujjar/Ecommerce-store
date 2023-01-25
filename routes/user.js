const express = require('express');
const router = express.Router();
const { userById } = require("../controllers/user");
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth");

// Routes
router.get("/secret/:userId", requireSignin, (req, res) => {
    res.json({
        user: req.profile
    });
});
router.param('userid', userById);

module.exports = router;