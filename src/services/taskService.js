require("dotenv").config();

const db = require("../config/db");

const createTask = async (userId, title, description, status, due_date) => {
    const [result] = await db.query(`call createNewTask(?,?,?,?,?)`, [userId, title, description, status, due_date]);
    return [result];
}

module.exports = {
    createTask
}