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

        var apiEvent = `getAllUserList`;
        
        const [rowData] = await db.query(`CALL getUserList(?,?)`, [apiEvent, '']);
        if (!rowData[0].length) {

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
       
        var apiEvent = `existingUser`;

        const { Name, Email, Password } = req.body;

        if (!Name || !Email || !Password) {

            const error = new Error (`All fields are required! `);
            error.statusCode = 400;
            return next(error);
        }

        // Check if email already exists
        const [existingUser] = await db.query(`call getUserList(?,?)`,[apiEvent, Email]);

        if ((existingUser[0][0] || {}).in_ExistingUserId > 0) {
            console.log(`Email already exists! `);

            const error = new Error (`Email already exists! `);
            error.statusCode = 409;
            return next(error);

        }

        // generate a hash password for the newly created user

        const hashPassword = await hashPasswordCreate(Password);
        // console.log(hashPassword);
        
        const [result] = await db.query(`call newUserRegistration(?,?,?)`, [Name, Email, hashPassword]);

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

        var apiEvent = `extractUserInformation`; 

        const { Email, Password } = req.body;

        const [users] = await db.query(`call getUserList(?,?)`, [apiEvent, Email]);

        if (users[0].length === 0) {

            const error = new Error(`user not exist in database !`);
            error.statusCode = 400;
            return next(error);

        }

        const userSavePassword = users[0][0].Password;
        var userExistingId = users[0][0].id;
        var userExistingName = users[0][0].Name;
        var userExistingEmail = users[0][0].Email;

        // var fetchSavePassword = user;

        if (!Email || !Password) {

            const error = new Error(`Invalid Credential! `);
            error.statusCode = 401;
            return next(error);

        }

        // verify hashpassword here and login in app

        const isValidPassword = await hashPasswordVerification(Password, userSavePassword);

        const token = generateToken({
            id: userExistingId,
            name: userExistingName,
            email: userExistingEmail
        });

        if (isValidPassword && userExistingEmail === Email) {
            console.log(` logedIn successfully !`);
            return res.status(200).json({
                message: "Login successful.",
                token,
                user: {
                    id: userExistingId,
                    name: userExistingName,
                    email: userExistingEmail
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