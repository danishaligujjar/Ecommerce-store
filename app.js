//REQUIRED FILES
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

// APP
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

//route middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);

//DB Connection
mongoose.connect(process.env.DATABASE).then(()=>console.log('database connected'));

const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});