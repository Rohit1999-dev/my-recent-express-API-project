const express = require('express');
const rateLimit = require("express-rate-limit");

const router = express.Router();
const userController = require('../controllers/user.controller');

const signupLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,              
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests. Please try again later.",

});

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,              
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests. Please try again later.",

});

const healthCheckApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,              
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests. Please try again later.",

});


router.get('/health', healthCheckApiLimiter, userController.healthCheck);
router.get('/testing', userController.getLoadResult);
router.get('/user', userController.getAllUsers);
router.post('/signupcreate', signupLimiter, userController.createUser);
router.post('/login', loginLimiter, userController.userLogin);


module.exports = router;

