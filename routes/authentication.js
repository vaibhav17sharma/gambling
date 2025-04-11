const express = require('express');
const router = express.Router();

const authencticationController = require('../contollers/authenticationController');


router.post('/signup', authencticationController.signup);

module.exports = router;