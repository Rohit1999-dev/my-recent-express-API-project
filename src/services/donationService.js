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

const getDonationCurrencyByParams = async (currency) => {
    const [result] = await db.query("select * from donation_data where Donation_Currency = ?", [currency]); 
    return [result];
}

const getDonationListByDateFilter = async (startDate, endDate) => {
    const [result] = await db.query("select * from donation_data where Date BETWEEN ? and ? ", [startDate, endDate]); 
    return [result];
}

const getDonationSummary = async () => {
    const [result] = await db.query("call getDonationSummaryDetails()", []); 
    return [result];
}

const getCheckForExistingOrder = async (OrderId) => {
    const [result] = await db.query("select * from donation_data where OrderId = ? ", [OrderId]);
    return [result];
}

const createDonation = async (operation, Date, OrderId, Nonprofit, Donation_Currency, Donation_Amount, Fee) => {
    const [result] = await db.query("call createTaskForNewDonation(?,?,?,?,?,?,?)", [operation, Date, OrderId, Nonprofit, Donation_Currency, Donation_Amount, Fee]);
    return [result];
}

module.exports = {
    getDonationData,
    getDonationByGivenId,
    getDonationDataByNonProfitParams,
    getDonationCurrencyByParams,
    getDonationListByDateFilter,
    getDonationSummary,
    getCheckForExistingOrder,
    createDonation
}