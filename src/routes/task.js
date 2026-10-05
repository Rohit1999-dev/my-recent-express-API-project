const express = require('express');
const { authMiddleware } = require('../utils/authMiddleware');


const router = express.Router();

const taskController = require('../controllers/task.controller');

router.post('/task', authMiddleware, taskController.createTask);


module.exports = router;