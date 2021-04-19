const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller');

router.post('/forgotPassword', UserController.forgotPassword);
router.post('/resetPassword', UserController.resetPassword);

module.exports = router;
