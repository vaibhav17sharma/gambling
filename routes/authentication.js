const express = require('express');
const router = express.Router();

const authenticationController = require('../contollers/authenticationController');


router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);

module.exports = router;