require("dotenv").config();
const taskService = require('../services/taskService');

const createTask = async (req, res, next) => {
    try {

        const taskId = 0;
        const operation = 'CREATE_NEW_TASK';
        const { title, description, status, due_date } = req.body;

        if (!title) {

            const error = new Error(`Title is required! `);
            error.statusCode = 400;
            return next(error);
        }
        const userId = req.user.id;
        const [result] = await taskService.createTask(operation, userId, taskId, title, description, status, due_date);
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                id: result[0][0].id,
                user_id: userId,
                title,
                description: description || null,
                status: status || "pending",
                due_date: due_date || null
            }
        });


    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getAllTask = async (req, res, next)=>{
    try {
        const operation = 'GET_ALL_TASK_BY_USERID';
        const userId = req.user.id;
        const [rowData] = await taskService.getAllTaskList(userId, operation);
         if (!rowData[0].length) {

            const error = new Error ("No task found !");
            error.statusCode = 404;
            return next(error);
            
        }
        return res.send({
            message: rowData,
            statusCode: 200
        })

    } catch (error) {
        console.error(`Error in getAllTask:`, error.message);
        const newError = new Error (`Error in getAllTask: -- 49`);
        newError.statusCode = 500;
        return next(newError);
    }
}

const getTaskByTaskId = async (req, res, next)=>{
    try {
        const operation = 'INDIVIDUAL_TASK_GET'
        const paramId = req.params.id;
        const userId = req.user.id;
        const [rowData] = await taskService.getTaskIdByUserId(userId, operation, paramId);
         if (!rowData[0].length) {

            const error = new Error ("No task found !");
            error.statusCode = 404;
            return next(error);
            
        }
        return res.send({
            message: rowData,
            statusCode: 200
        })

    } catch (error) {
        console.error(`Error in getAllTask:`, error.message);
        const newError = new Error (`Error in getAllTask: -- 49`);
        newError.statusCode = 500;
        return next(newError);
    }
}

const updateTaskIdByUserId = async(req, res, next)=>{
    
    try {
        const operation = 'UPDATE_INDIVIDUAL_TASK_BY_USERID'
        const paramId = req.params.id;
        const userId = req.user.id;
        const { title, description, status, due_date } = req.body;
        const [rowData] = await taskService.updateTaskIdByUser(operation, userId, paramId, title, description, status, due_date);

        if (rowData.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not updated !"
            });
        }
        return res.send({
            message: rowData,
            statusCode: 200
        })

    } catch (error) {
        console.error(`Error in updateTaskIdByUserId:`, error.message);
        const newError = new Error (`Error in updateTaskIdByUserId: -- 113`);
        newError.statusCode = 500;
        return next(newError);
    }

}

module.exports = {
    createTask,
    getAllTask,
    getTaskByTaskId,
    updateTaskIdByUserId
}