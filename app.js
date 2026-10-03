
var express = require('express');
// const rateLimit = require("express-rate-limit");

var db = require('./src/config/db.js');
var userRoutes = require('./src/routes/user.js');
var errorHandlerRoutes = require('./src/utils/errorHandler.js');
var app = express();

// const apiLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000,
//   limit: 5,              
//   standardHeaders: "draft-8",
//   legacyHeaders: false,
//   message: "Too many requests. Please try again later.",

// });

app.use(express.json());

// middleware
app.use((req, res, next)=>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
})

// app.use('/api', apiLimiter, userRoutes);

app.use('/api', userRoutes);
app.use(errorHandlerRoutes);


module.exports = app;


