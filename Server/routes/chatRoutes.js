const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const chatController = require('../controllers/chatController');

// root route: /api/chat

router.get('/', authenticate, chatController.getAllChats);
router.post('/', authenticate, chatController.createChat);

router.post('/group',authenticate, chatController.createGroupChat);
router.put('/rename',authenticate, chatController.renameGroupChat);
router.put('/removemember',authenticate, chatController.removeMemberFromGroupChat);
router.put('/addmember',authenticate, chatController.addMemberToGroupChat);

module.exports = router;