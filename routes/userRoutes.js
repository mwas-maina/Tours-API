const express = require('express');

const authController = require('../controller/authController');

const router = express.Router();

const userController = require('../controller/userController');

router.route('/signup').post(authController.signup);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
module.exports = router;
