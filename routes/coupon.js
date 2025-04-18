const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');


router.get('/', couponController.getCoupons) ;
router.post('/buy', couponController.buyCoupon);
router.post('/redeem', couponController.redeemCoupon);

module.exports = router;