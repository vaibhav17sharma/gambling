var express = require('express');
var router = express.Router();

const userModel = require('../models/user');
const userController = require('../controllers/userController');
const { routes } = require('../app');

/* GET users listing. */

router.get('/' , userController.getAllUser);
router.get('/balance', userController.getUserBalance);
router.get('/profile', userController.getUserProfile);
router.get('/paymentQRCode', userController.getPaymentQrCode);
router.post('/user-accounts', userController.saveUserAccount);
router.get('/purchased-coupons', userController.getUserPurchasedCoupons);
router.get('/coupons-spin-details/:usercouponId', userController.getUserSpinDetails);

router.post('/add-wallet-topup', userController.addWalletTopup);
router.get('/:userId/transactions', userController.getUserTransactions);

router.get('/admin-wallet', userController.getAdminWallets);
router.put('/admin-wallet', userController.addOrUpdateAdminWallet);
router.delete('/admin-wallet', userController.deleteAdminWallet);

module.exports = router;
 