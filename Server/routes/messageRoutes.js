const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const messageController = require('../controllers/messageController');

// root route: /message
router.get('/:chatId',authenticate,  messageController.getAllMessages);
router.post('/', authenticate, messageController.sendMessage);

module.exports = router;