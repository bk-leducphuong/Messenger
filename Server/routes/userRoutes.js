import express from 'express';
import { getUserInfo, updateUserInfo, updateUserStatus } from '../controllers/userController.js';

const router = express.Router();

// root route: /api/users
router.get("/:id", getUserInfo);
router.put("/:id", updateUserInfo);
router.put("/:id/status", updateUserStatus);

export default router;