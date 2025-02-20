import express from 'express';
import { getUserInfo, updateUserInfo } from '../controllers/userController.js';

const router = express.Router();

// root route: /api/users
router.get("/:id", getUserInfo);
router.put("/:id", updateUserInfo);

export default router;