require("dotenv").config();

const donationService = require('../services/donationService');

const getAllDonation = async (req, res, next) => {
    try {

        const nonprofit = (req.query.nonprofit || '');
        if (nonprofit.trim() !== '') {
            var [resultData] = await donationService.getDonationDataByNonProfitParams(nonprofit);
            return res.send({
                stausCode: 200,
                data: resultData
            })
        }

        const currency = (req.query.Donation_Currency || '');
        if(currency.trim() !== ''){
            var [resultData] = await donationService.getDonationCurrencyByParams(currency);
            return res.send({
                stausCode: 200,
                data: resultData
            })
        }

        const { startDate, endDate } = req.query;

        if(startDate.trim() !== '' && endDate.trim() !== ''){

            const [resultData] = await donationService.getDonationListByDateFilter(startDate, endDate);
            return res.send({
                stausCode: 200,
                data: resultData
            })
        }

        var [resultData] = await donationService.getDonationData();
        if (resultData.length == 0) {
            return res.send({
                stausCode: 400,
                data: resultData,
                message: `No Donation list found !`
            })
        }
        return res.send({
            stausCode: 200,
            data: resultData
        })

    } catch (error) {
        console.log(`Error in getAllDonation function ! `, error);
        const newError = new Error(`Error in getAllDonation function ! `);
            newError.statusCode = 500;
        return next(newError);
    }
}

const getDonationById = async (req, res, next) => {
    try {
        var id = req.params.id;
        var [resultData] = await donationService.getDonationByGivenId(id);
        console.log(resultData);
        if (!resultData.length) {

            return res.send({
                statusCode: 404,
                message: `No row Found by given Id - ${id}`
            });
        }
        return res.send({
            statusCode: 200,
            data: resultData
        });
    } catch (error) {
        console.log(`Error in getDonationById function ! `, error);
        const newError = new Error(`Error in getDonationById function ! `);
            newError.statusCode = 500;
        return next(newError);

    }

}

const getDonationSummaryDetails = async (req, res, next) => {
    try {
        const donationSummary = {};
        const [result] = await donationService.getDonationSummary();
        if(!result.length){
            return res.send({
                statusCode: 404,
                message: `No SummaryDetails Found  !`
            });
        }
        donationSummary.totalDonationAmount = result[0][0].in_totalTransactions ;
        donationSummary.totalTransactions = result[0][0].in_totalDonationAmount;
        donationSummary.totalFee = result[0][0].in_totalFee;

        donationSummary.donationsByCurrency = result[1];

        return res.send({
            stausCode: 200,
            summary: donationSummary
        });
        
    } catch (error) {
        console.log(`Error in getDonationSummaryDetails function ! `, error);
        const newError = new Error(`Error in getDonationSummaryDetails function ! `);
            newError.statusCode = 500;
        return next(newError);
    }
}

const createDonationTask = async (req, res, next) => {
    try {
        const {
            Date,
            OrderId,
            Nonprofit,
            Donation_Currency,
            Donation_Amount,
            Fee
        } = req.body;

        const operation = 'CREATE_NEW_TASK';

        if (!Date || !OrderId || !Nonprofit || !Donation_Currency || !Donation_Amount || !Fee) {

            const error = new Error(`All fields are required! `);
            error.statusCode = 400;
            return next(error);
        }

        const existingOrderId = await donationService.getCheckForExistingOrder(OrderId);

        if (existingOrderId[0].length > 0) {

            const error = new Error(`orderId Already exist in list !`);
            error.statusCode = 409;
            return next(error);
        }

        const newTask = await donationService.createDonation(operation, Date, OrderId, Nonprofit, Donation_Currency, Donation_Amount, Fee, '');
        if(newTask[0][0][0].id > 0){
            return res.send({
                stausCode: 201,
                success: true,
                message: "Task created successfully for createDonationTask !",
            }); 
        }
    } catch (error) {
        console.log(`Error in createDonationTask function ! `, error);
        const newError = new Error(`Error in createDonationTask function ! `);
            newError.statusCode = 500;
        return next(newError);
    }
}

const updateDonationTask = async (req, res, next) => {
    try {
        const {
                Date,
                OrderId,
                Nonprofit,
                Donation_Currency,
                Donation_Amount,
                Fee
        } = req.body;

        const operation = 'UPDATE_EXISTING_TASK';

        const _id = req.params.id;
        const existingId = await donationService.getCheckForExistingId(_id);
        console.log(existingId);
        
        if(existingId[0].length == 0){

            return res.send({
                stausCode: 404,
                message: "Record not existing !",
            }); 
        }

        const _updateTask = await donationService.updateTaskByIdParam(operation, Date, OrderId, Nonprofit, Donation_Currency, Donation_Amount, Fee, _id);

        if(_updateTask[0].affectedRows == 1){
             return res.send({
                stausCode: 200,
                message: "Record updated successfully !",
            });
        };        

    } catch (error) {
        console.log(`Error in updateDonationTask function ! `, error);
        const newError = new Error(`Error in updateDonationTask function ! `);
            newError.statusCode = 500;
        return next(newError);
    }
}

module.exports = {
    getAllDonation,
    getDonationById,
    getDonationSummaryDetails,
    createDonationTask,
    updateDonationTask
}