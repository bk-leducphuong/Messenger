import express from 'express';
import { login, register, forgotPassword, resetPassword, logout } from '../controllers/authController.js';
import  authenticate from '../middleware/authenticate.js';

const router = express.Router();

// root route: /api/auth
router.post('/login', login);
router.post('/register', register);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.get('/logout', authenticate, logout);

export default router;