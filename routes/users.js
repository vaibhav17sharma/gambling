var express = require('express');
var router = express.Router();

const userModel = require('../models/user');
const userController = require('../controllers/userController');

/* GET users listing. */

router.get('/balance', userController.getUserBalance);
router.get('/profile', userController.getUserProfile);
router.get('/paymentQRCode', userController.getPaymentQrCode);
router.post('/user-accounts', userController.saveUserAccount);
router.get('/purchased-coupons', userController.getUserPurchasedCoupons);
router.get('/coupons-spin-details/:usercouponId', userController.getUserSpinDetails);

router.patch('/:userId/transaction', userController.updateTransaction);
router.get('/:userId/transactions', userController.getUserTransactions);
module.exports = router;
 