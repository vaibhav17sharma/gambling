var express = require('express');
var router = express.Router();
var UserController = require('../controllers/userController');

/* GET users listing. */
router.get('/auth', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/balance', UserController.getUserBalance);

module.exports = router;
