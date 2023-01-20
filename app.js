//REQUIRED FILES
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user.js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// APP
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//route middleware
app.use('/api', userRoutes)

//DB Connection
mongoose.connect(process.env.DATABASE).then(()=>console.log('database connected sir'));

const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});