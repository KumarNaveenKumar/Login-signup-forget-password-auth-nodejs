const express = require('express');
const router = express.Router();

const UserController = require('../Controllers/user');

router.get('/all/users', UserController.getAll);
router.post('/auth/signup', UserController.create);
router.post('/auth/login', UserController.login);
router.post('/auth/forgetPassword/getOtp', UserController.genOtp);
router.post('/auth/forgetPassword/verifyOtp', UserController.verifyOtp);
router.post('/auth/restPassword', UserController.resetPassword);

module.exports = router;