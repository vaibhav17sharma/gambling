const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const multer = require('multer');
const upload = multer(); // no storage needed if no file


router.get('/', couponController.getCoupons) ;
router.post('/buy', couponController.buyCoupon);
router.post('/redeem', couponController.redeemCoupon);
router.post('/add',upload.single('image'),couponController.addCoupon);
router.delete('/:id', couponController.deleteCoupon);
module.exports = router;