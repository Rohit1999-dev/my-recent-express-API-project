require("dotenv").config();

const db = require("../config/db");

const createTask = async (operation, userId, taskId, title, description, status, due_date) => {
    const [result] = await db.query(`call createAndUpdateTask(?,?,?,?,?,?,?)`, [operation, userId, taskId, title, description, status, due_date]);
    return [result];
}

const getAllTaskList = async (userId, operation) => {
    const [rowData] = await db.query(`CALL getTaskList(?,?,?)`, [userId, operation, '']);
    return [rowData];
}

const getTaskIdByUserId = async (userId, operation, paramId) => {
    const [rowData] = await db.query(`CALL getTaskList(?,?,?)`, [userId, operation, paramId]);
    return [rowData];
}

const updateTaskIdByUser = async (operation, userId, paramId, title, description, status, due_date) => {
    const [rowData] = await db.query(`CALL createAndUpdateTask(?,?,?,?,?,?,?)`, [operation, userId, paramId, title, description, status, due_date]);
    return [rowData];
}

module.exports = {
    createTask,
    getAllTaskList,
    getTaskIdByUserId,
    updateTaskIdByUser
}