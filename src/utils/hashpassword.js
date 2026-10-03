require("dotenv").config();

const bcrypt = require("bcrypt");

const hashPasswordCreate = async (password)=>{
    return await bcrypt.hash(password, Number(process.env.SALT));
}


const hashPasswordVerification = async (Password, hashpassword)=>{
    return await bcrypt.compare(
            Password,          // password entered by user
            hashpassword     // hashed password from database
        );
}

module.exports = {
    hashPasswordCreate,
    hashPasswordVerification
}