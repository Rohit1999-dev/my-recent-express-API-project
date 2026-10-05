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

const getUserDetailsByEmail = async(operation, Email)=>{

    const [users] = await db.query(`call getUserList(?,?)`, [operation, Email]);
    return [users];
}

const createNewUser = async(Name, Email, hashPassword)=>{
    const [result] = await db.query(`call newUserRegistration(?,?,?)`, [Name, Email, hashPassword]);
    return [result];
}

module.exports = {
    getUserDetails,
    isEmailAlreadyExist,
    getUserDetailsByEmail,
    createNewUser
}