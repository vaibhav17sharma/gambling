const { successResp, failureResp } = require('../utils/response');
const couponModel = require('../models/coupons');

async function getCoupons() {
    let coupons = await couponModel.findAll();
    return coupons;
}

module.exports = {
    getCoupons
}