const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// root route: /api/auth
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.get('/logout', authController.logout);

module.exports = router;