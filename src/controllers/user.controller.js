require("dotenv").config();
const { generateToken } = require('../utils/jwt');
const { hashPasswordCreate, hashPasswordVerification } = require('../utils/hashpassword');
const db = require("../config/db");


const healthCheck = async (req, res, next) => {
    try {
        console.log(`healthCheck API 123 !`);

        res.status(200).json({
            status: "OK",
            message: "Backend API is healthy"
        });
    } catch (error) {
        console.error(`Error in healthCheck API:`, error.message);
        const newError = new Error(`Error in healthCheck API: -- 17`);
        newError.statusCode = 500;
        return next(newError);
    }
}

const getLoadResult = async (req, res, next) => {
    console.log(`Calculation number !`);
    
    try {
        let total = 0;
        for (let index = 0; index < 5000000000; index++) {
             total += index ;
            
        }
        return res.status(200).json({
            sucess: true,
            total
        });
    } catch (error) {
        console.log(`Error in getLoadResult fucntion/API ! `, error);
        const newError = new Error (`Error in getLoadResult fucntion/API ! -- 31`);
        newError.statusCode = 500;
        return next(newError);
        
    }
}

const getAllUsers = async (req, res, next) => {
    
    try {
        console.log(`getAllUser controller bind 13 !`);
        
        // const sql = `SELECT * FROM user_details`;
        const [rowData] = await db.query(`CALL getUserList()`);
        if (!rowData.length) {

            const error = new Error ("No users found");
            error.statusCode = 404;
            return next(error);
            
        }
        return res.send({
            message: rowData,
            statusCode: 200
        });

    } catch (error) {
        console.error(`Error in getAllUsers:`, error.message);
        const newError = new Error (`Error in getAllUsers: -- 60`);
        newError.statusCode = 500;
        return next(newError);
    }
};

const createUser = async (req, res, next) => {
    try {
       
        const { Name, Email, Password } = req.body;

        if (!Name || !Email || !Password) {

            const error = new Error (`All fields are required! `);
            error.statusCode = 400;
            return next(error);
        }

        // Check if email already exists
        const [existingUser] = await db.query(
            `SELECT id FROM user_details WHERE Email = ?`,
            [Email]
        );

        if (existingUser.length > 0) {
            console.log(`Email already exists! `);

            const error = new Error (`Email already exists! `);
            error.statusCode = 409;
            return next(error);

        }

        // generate a hash password for the newly created user

        const hashPassword = await hashPasswordCreate(Password);

        const sql = `INSERT INTO user_details (Name, Email, Password) VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [Name, Email, hashPassword]);

        // generate a token for the newly created user
        // const token = generateToken({
        //     id: result.insertId,
        //     name: Name,
        //     email: Email
        // });

        res.send({
            message: `User signup created successfully!`,
            statusCode: 200
        });

    } catch (error) {
        console.error(`Error in createUser:`, error.message);
        const newError = new Error (`Error in createUser: -- 114`);
        newError.statusCode = 500;
        return next(newError);
    }
};

const userLogin = async (req, res, next) => {
    try {

        const { Email, Password } = req.body;

        const [users] = await db.query(`SELECT * FROM user_details WHERE Email = ?`, [Email]);

        if (users.length === 0) {

            const error = new Error(`user not exist in database !`);
            error.statusCode = 400;
            return next(error);

        }

        const user = users[0];

        if (!Email || !Password) {

            const error = new Error(`Invalid Credential! `);
            error.statusCode = 401;
            return next(error);

        }

        // verify hashpassword here and login in app

        const isValidPassword = await hashPasswordVerification(Password, user.Password);

        const token = generateToken({
            id: user.id,
            name: user.Name,
            email: user.Email
        });

        if (isValidPassword && user.Email === Email) {
            console.log(` logedIn successfully !`);
            return res.status(200).json({
                message: "Login successful.",
                token,
                user: {
                    id: user.id,
                    name: user.Name,
                    email: user.Email
                }
            });
        }
        else {

            const error = new Error(`Invalid password!`);
            error.statusCode = 401;
            return next(error);
        }


    } catch (error) {

        console.error(`Error in userLogin:`, error.message);
        const newError = new Error (`Error in userLogin: -- 178`);
        newError.statusCode = 500;
        return next(newError);
    }
}

module.exports = {
    healthCheck,
    getLoadResult,
    getAllUsers,
    createUser,
    userLogin
};