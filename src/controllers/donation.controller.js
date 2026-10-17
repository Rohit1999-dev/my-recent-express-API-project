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
            })
        
    } catch (error) {
        console.log(`Error in getDonationSummaryDetails function ! `, error);
        const newError = new Error(`Error in getDonationSummaryDetails function ! `);
            newError.statusCode = 500;
        return next(newError);
    }
}

module.exports = {
    getAllDonation,
    getDonationById,
    getDonationSummaryDetails
}