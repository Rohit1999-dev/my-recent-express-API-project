require("dotenv").config();

const db = require("../config/db");

const getDonationData = async () => {
    const [result] = await db.query(`select * from donation_data`, []);
    return [result];
}

const getDonationByGivenId = async (id) => {
    const [result] = await db.query(`select * from donation_data where id = ${id}`, []);
    return [result];
}   

const getDonationDataByNonProfitParams = async (nonprofit) => {
    const [result] = await db.query("select * from donation_data where Nonprofit = ?", [nonprofit]); 
    return [result];
}

module.exports = {
    getDonationData,
    getDonationByGivenId,
    getDonationDataByNonProfitParams
}