const express = require('express');
const { authMiddleware } = require('../utils/authMiddleware');


const router = express.Router();

const taskController = require('../controllers/task.controller');

router.post('/task', authMiddleware, taskController.createTask);
router.get('/task', authMiddleware, taskController.getAllTask);
router.get('/task/:id', authMiddleware, taskController.getTaskByTaskId);
router.put('/update/:id', authMiddleware, taskController.updateTaskIdByUserId);



module.exports = router;