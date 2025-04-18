const { successResp, failureResp } = require('../utils/response');
const CouponModel = require('../models/coupons');
const UserCoupons = require('../models/userCoupons')
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
const UserWallet = require('../models/userWallet');
const WalletTransactionModel = require('../models/walletTransactions');


async function getCoupons(req, res, next) {
    let coupons = await CouponModel.findAll({where:{deleted_at : null}});
    if(!coupons) {
        return failureResp(res, "No coupons found", 404);
    }
    return successResp(res, "Coupon Data", 200,coupons);
}

async function buyCoupon(req, res, next) {
    let userId = req.user.id;
    let couponId = req.body.coupon_id;


    const CouponData=await CouponModel.findOne({where:{id:couponId,deleted_at : null}});
    if(!CouponData) {
        return failureResp(res, "Coupon not found", 404);
    }
    const results = await sequelize.query(`
        SELECT c.id, c.coupon_name,c.price,
        c.spin_days
        FROM coupons c
        JOIN user_coupons uc ON c.id = uc.coupon_id
         WHERE uc.user_id = :userId
          AND uc.coupon_id = :couponId
          AND uc.deleted_at IS NULL
          AND c.deleted_at IS NULL
          AND DATE_ADD(uc.created_at, INTERVAL c.spin_days DAY) >= NOW()
        LIMIT 1;
    `, {
        replacements: { userId, couponId },
        type: Sequelize.QueryTypes.SELECT
    });
    
    if (results && results.length > 0) {
        return failureResp(res, "Coupon already purchased", 409,results);
    }

    UserAmount=await UserWallet.findOne({where:{user_id:userId}});
    if(!UserAmount) {
        return failureResp(res, "User wallet not found", 404);
    }
    if(UserAmount.avl_amount < CouponData.price) {
        return failureResp(res, "Insufficient balance", 400);
    }
    let userCouponData = {
        user_id: userId,
        coupon_id: couponId,
        created_at: new Date(),
        updated_at: new Date()
    };
    let coupon_data=await UserCoupons.create(userCouponData);   
    if(!coupon_data) {
        return failureResp(res, "Coupon purchase failed", 500);
    }

    let transactionData = {
        user_wallet_id: UserAmount.id,
        transaction_type: 'debit',
        transaction_amount: CouponData.price,
        admin_wallets_id: null,
        type: 'debit',
        description: `Coupon purchase for coupon ID ${couponId}`,
        created_at: new Date(),
        updated_at: new Date()
    };
    let transaction=await WalletTransactionModel.create(transactionData);
    if(!transaction) {
        return failureResp(res, "Transaction failed", 500);
    }
    UserAmount.avl_amount = UserAmount.avl_amount - results.price;
    await UserAmount.save();
    return successResp(res, "Coupon purchased successfully", 200);
}

module.exports = {
    getCoupons,
    buyCoupon
}