import express from 'express';
import { searchUsersAndConversations } from '../controllers/searchController.js';
import authenticate from '../middleware/authenticate.js';
const router = express.Router();

// root route: /api/search
router.get('/', authenticate, searchUsersAndConversations);

export default router;
