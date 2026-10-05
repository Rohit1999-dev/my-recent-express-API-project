require("dotenv").config();
const taskService = require('../services/taskService');
const db = require("../config/db");


const createTask = async (req, res, next) => {
    try {

        const { title, description, status, due_date } = req.body;

        if (!title) {

            const error = new Error(`Title is required! `);
            error.statusCode = 400;
            return next(error);
        }
        const userId = req.user.id;
        const [result] = await taskService.createTask(userId, title, description, status, due_date);
        // const [result] = await db.query(`call createNewTask(?,?,?,?,?)`, [userId, title, description, status, due_date]);
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

module.exports = {
    createTask
}