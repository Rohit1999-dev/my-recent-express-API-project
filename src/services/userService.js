require("dotenv").config();

const db = require("../config/db");

const getUserDetails = async (operation) => {
    const [rowData] = await db.query(`CALL getUserList(?,?)`, [operation, '']);
    return [rowData];
}

const isEmailAlreadyExist = async (operation, Email) => {
    const [existingUser] = await db.query(`call getUserList(?,?)`,[operation, Email]);
    return [existingUser];
}

module.exports = {
    getUserDetails,
    isEmailAlreadyExist
}