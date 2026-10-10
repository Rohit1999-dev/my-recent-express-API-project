require("dotenv").config();

const donationService = require('../services/donationService');

const getAllDonation = async (req, res, next) => {
    try {

       const nonprofit =  (req.query.nonprofit || '');
       if(nonprofit.trim() !== ''){
            var [resultData] = await donationService.getDonationDataByNonProfitParams(nonprofit);
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

    }

}

module.exports = {
    getAllDonation,
    getDonationById
}