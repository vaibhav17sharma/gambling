var express = require('express');
var router = express.Router();

const userModel = require('../models/user');
const userController = require('../controllers/userController');

/* GET users listing. */

router.get('/balance', UserController.getUserBalance);
router.get('/profile', userController.getUserProfile);
router.get('/paymentQrCode', userController.getPaymentQrCode);

module.exports = router;
 