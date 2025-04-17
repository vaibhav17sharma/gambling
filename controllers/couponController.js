const { successResp, failureResp } = require('../utils/response');
const {Coupons} = require('../models/coupons');
const {UserCoupons} = require('../models/userCoupons')


async function getCoupons(req, res, next) {
    let coupons = await couponModel.findAll();
    return coupons;
}

async function buyCoupon(req, res, next) {
    let userId = req.user.id;
    let couponId = req.body.id;

    let coupon = await Coupons.findOne({where : {'id' : couponId} });
     
    if(!coupon) {
        return failureResp(res, "Coupon not found", 404);
    }

}

module.exports = {
    getCoupons,
    buyCoupon
}